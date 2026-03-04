import { describe, it, expect, vi } from 'vitest'
import {
  validateImageFile,
  formatFileSize,
  createImagePreview,
  compressImage,
  MAX_FILE_SIZE,
  MAX_WIDTH,
  MAX_HEIGHT,
  COMPRESSION_QUALITY,
  ACCEPTED_FORMATS
} from '../image'

describe('validateImageFile', () => {
  const makeFile = (type: string, size: number) =>
    new File(['x'.repeat(size)], 'test.jpg', { type })

  it('returns null for valid JPEG file', () => {
    expect(validateImageFile(makeFile('image/jpeg', 1000))).toBeNull()
  })

  it('returns null for valid PNG file', () => {
    expect(validateImageFile(makeFile('image/png', 1000))).toBeNull()
  })

  it('returns null for valid WebP file', () => {
    expect(validateImageFile(makeFile('image/webp', 1000))).toBeNull()
  })

  it('returns error for invalid format', () => {
    const result = validateImageFile(makeFile('image/gif', 1000))
    expect(result).toBeTruthy()
    expect(result).toContain('inválido')
  })

  it('returns error for file too large', () => {
    const result = validateImageFile(makeFile('image/jpeg', MAX_FILE_SIZE + 1))
    expect(result).toBeTruthy()
    expect(result).toContain('grande')
  })
})

describe('formatFileSize', () => {
  it('formats 0 bytes', () => {
    expect(formatFileSize(0)).toBe('0 B')
  })

  it('formats bytes', () => {
    expect(formatFileSize(500)).toBe('500.0 B')
  })

  it('formats kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB')
  })

  it('formats megabytes', () => {
    expect(formatFileSize(1048576)).toBe('1.0 MB')
  })

  it('formats fractional megabytes', () => {
    expect(formatFileSize(1572864)).toBe('1.5 MB')
  })
})

describe('createImagePreview', () => {
  it('returns a data URL string', async () => {
    const blob = new Blob(['test'], { type: 'image/jpeg' })
    const file = new File([blob], 'test.jpg', { type: 'image/jpeg' })

    // happy-dom supports FileReader
    const result = await createImagePreview(file)
    expect(typeof result).toBe('string')
    expect(result).toContain('data:')
  })
})

describe('ACCEPTED_FORMATS', () => {
  it('contains jpeg, png, and webp', () => {
    expect(ACCEPTED_FORMATS).toContain('image/jpeg')
    expect(ACCEPTED_FORMATS).toContain('image/png')
    expect(ACCEPTED_FORMATS).toContain('image/webp')
  })
})

describe('constants', () => {
  it('MAX_FILE_SIZE is 2MB', () => {
    expect(MAX_FILE_SIZE).toBe(2 * 1024 * 1024)
  })

  it('MAX_WIDTH is 1024', () => {
    expect(MAX_WIDTH).toBe(1024)
  })

  it('MAX_HEIGHT is 1024', () => {
    expect(MAX_HEIGHT).toBe(1024)
  })

  it('COMPRESSION_QUALITY is 0.85', () => {
    expect(COMPRESSION_QUALITY).toBe(0.85)
  })
})

describe('createImagePreview error handling', () => {
  it('rejects when FileReader fails', async () => {
    const origFileReader = globalThis.FileReader
    function MockFileReader (this: {
      onerror: (() => void) | null;
      onload: ((e: unknown) => void) | null;
      readAsDataURL: () => void;
    }) {
      this.onerror = null
      this.onload = null
      this.readAsDataURL = () => {
        setTimeout(() => this.onerror?.(), 0)
      }
    }
    globalThis.FileReader = MockFileReader as unknown as typeof FileReader

    const file = new File(['x'], 'test.jpg', { type: 'image/jpeg' })
    await expect(createImagePreview(file)).rejects.toThrow('Error reading file')
    globalThis.FileReader = origFileReader
  })

  it('rejects when result is null', async () => {
    const origFileReader = globalThis.FileReader
    function MockFileReader (this: {
      onerror: (() => void) | null;
      onload: ((e: unknown) => void) | null;
      readAsDataURL: () => void;
    }) {
      this.onerror = null
      this.onload = null
      this.readAsDataURL = () => {
        setTimeout(() => this.onload?.({ target: { result: null } }), 0)
      }
    }
    globalThis.FileReader = MockFileReader as unknown as typeof FileReader

    const file = new File(['x'], 'test.jpg', { type: 'image/jpeg' })
    await expect(createImagePreview(file)).rejects.toThrow('Failed to read file')
    globalThis.FileReader = origFileReader
  })
})

describe('compressImage', () => {
  it('rejects when canvas context is null', async () => {
    const origCreateElement = document.createElement.bind(document)
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'canvas') {
        const canvas = origCreateElement('canvas')
        vi.spyOn(canvas, 'getContext').mockReturnValue(null)
        return canvas
      }
      return origCreateElement(tag)
    })

    const file = new File(['x'], 'test.jpg', { type: 'image/jpeg' })
    await expect(compressImage(file)).rejects.toThrow('Could not get canvas context')

    vi.restoreAllMocks()
  })

  it('rejects when image fails to load', async () => {
    const origImage = globalThis.Image
    function MockImage (this: Record<string, unknown>) {
      this.onload = null
      this.onerror = null
      this.width = 0
      this.height = 0
      Object.defineProperty(this, 'src', {
        get: () => undefined,
        set () {
          setTimeout(() => (this.onerror as (() => void) | null)?.(), 0)
        },
        configurable: true
      })
    }
    globalThis.Image = MockImage as unknown as typeof Image
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')

    // Also mock canvas so we don't fail on getContext
    const origCreateElement = document.createElement.bind(document)
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'canvas') {
        const canvas = origCreateElement('canvas')
        vi.spyOn(canvas, 'getContext').mockReturnValue({
          drawImage: vi.fn()
        } as unknown as CanvasRenderingContext2D)
        return canvas
      }
      return origCreateElement(tag)
    })

    const file = new File(['x'], 'test.jpg', { type: 'image/jpeg' })
    await expect(compressImage(file)).rejects.toThrow('Failed to load image')

    globalThis.Image = origImage
    vi.restoreAllMocks()
  })

  function createImageMock (width: number, height: number) {
    const origImage = globalThis.Image
    function MockImage (this: Record<string, unknown>) {
      this.onload = null
      this.onerror = null
      this.width = width
      this.height = height
      Object.defineProperty(this, 'src', {
        get: () => undefined,
        set () {
          setTimeout(() => (this.onload as (() => void) | null)?.(), 0)
        },
        configurable: true
      })
    }
    globalThis.Image = MockImage as unknown as typeof Image
    return origImage
  }

  function createCanvasMock (blobResult: Blob | null) {
    const origCreateElement = document.createElement.bind(document)
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'canvas') {
        const canvas = origCreateElement('canvas')
        vi.spyOn(canvas, 'getContext').mockReturnValue({
          drawImage: vi.fn()
        } as unknown as CanvasRenderingContext2D)
        vi.spyOn(canvas, 'toBlob').mockImplementation((cb: (blob: Blob | null) => void) => {
          cb(blobResult)
        })
        return canvas
      }
      return origCreateElement(tag)
    })
  }

  it('compresses a wide image', async () => {
    const origImage = createImageMock(2048, 1024)
    createCanvasMock(new Blob(['compressed'], { type: 'image/jpeg' }))
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')

    const file = new File(['x'], 'test.jpg', { type: 'image/jpeg' })
    const result = await compressImage(file)
    expect(result).toBeInstanceOf(File)
    expect(result.name).toBe('test.jpg')

    globalThis.Image = origImage
    vi.restoreAllMocks()
  })

  it('compresses a tall image', async () => {
    const origImage = createImageMock(512, 2048)
    createCanvasMock(new Blob(['compressed'], { type: 'image/jpeg' }))
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')

    const file = new File(['x'], 'test.jpg', { type: 'image/jpeg' })
    const result = await compressImage(file)
    expect(result).toBeInstanceOf(File)

    globalThis.Image = origImage
    vi.restoreAllMocks()
  })

  it('handles small image without resizing', async () => {
    const origImage = createImageMock(200, 150)
    createCanvasMock(new Blob(['compressed'], { type: 'image/png' }))
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')

    const file = new File(['x'], 'test.png', { type: 'image/png' })
    const result = await compressImage(file)
    expect(result).toBeInstanceOf(File)

    globalThis.Image = origImage
    vi.restoreAllMocks()
  })

  it('rejects when blob is null', async () => {
    const origImage = createImageMock(100, 100)
    createCanvasMock(null)
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')

    const file = new File(['x'], 'test.jpg', { type: 'image/jpeg' })
    await expect(compressImage(file)).rejects.toThrow('Failed to compress image')

    globalThis.Image = origImage
    vi.restoreAllMocks()
  })
})
