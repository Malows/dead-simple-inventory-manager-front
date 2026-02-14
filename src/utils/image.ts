// Image handling utilities for product photos

export const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
export const ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_WIDTH = 1024
export const MAX_HEIGHT = 1024
export const COMPRESSION_QUALITY = 0.85

/**
 * Validates if a file is a valid image within size limits
 * @param file - The file to validate
 * @returns Error message if invalid, null if valid
 */
export function validateImageFile (file: File): string | null {
  if (!ACCEPTED_FORMATS.includes(file.type)) {
    return 'Formato inválido. Usa JPG, PNG o WebP'
  }

  if (file.size > MAX_FILE_SIZE) {
    const maxSizeMB = (MAX_FILE_SIZE / 1024 / 1024).toFixed(1)
    return `Archivo muy grande. Máximo ${maxSizeMB}MB`
  }

  return null
}

/**
 * Creates a temporary Data URL for image preview
 * @param file - The image file
 * @returns Promise resolving to a Data URL string
 */
export function createImagePreview (file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string)
      } else {
        reject(new Error('Failed to read file'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Error reading file'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Compresses an image file by resizing and reducing quality
 * @param file - The original image file
 * @returns Promise resolving to a compressed File
 */
export function compressImage (file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('Could not get canvas context'))
      return
    }

    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width
          width = MAX_WIDTH
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = (width * MAX_HEIGHT) / height
          height = MAX_HEIGHT
        }
      }

      // Set canvas dimensions
      canvas.width = width
      canvas.height = height

      // Draw resized image
      ctx.drawImage(img, 0, 0, width, height)

      // Convert to blob with compression
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'))
            return
          }

          // Create new File from blob
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          })

          resolve(compressedFile)
        },
        file.type,
        COMPRESSION_QUALITY
      )
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    // Load the image
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Formats file size to human readable string
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatFileSize (bytes: number): string {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}
