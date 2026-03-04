# IDEAS.md - Propuestas de Mejora

Este documento contiene propuestas de mejora identificadas durante el análisis del proyecto Dead Simple Inventory Manager Frontend.

## 🚨 Problemas Críticos Identificados

### 1. **Cobertura de Pruebas Muy Baja** (24.56% vs 80% requerido)
- **Problema**: Solo los servicios, stores y utils tienen buena cobertura. Todos los componentes Vue tienen 0% cobertura.
- **Impacto**: Alto riesgo de bugs en producción, especialmente en la UI.

## 📋 Plan de Mejoras Priorizadas

### **FASE 2: Calidad de Código** ✅ (Semanas 3-6)

#### 2.1 Eliminar Código Duplicado ✅
- ~~Crear componente base `BaseDeleteDialog.vue` para eliminar duplicación en 4 diálogos~~
- ~~Extraer lógica común de formularios CRUD~~

#### 2.2 Mejorar Logging (Omitido)
- Reemplazar `console.error` con logger estructurado
- Implementar niveles de log apropiados

#### 2.3 Internacionalización Completa ✅
- ~~Convertir strings hardcoded como `label="Stock"` a keys i18n~~
- ~~Auditar todos los componentes para strings no traducidos~~

#### 2.4 Refactorizar Componentes Grandes ✅
- ~~`TransferList.vue` (269 líneas) → dividir en componentes más pequeños~~
- ~~`ProductPhotoDialog.vue` (225 líneas) → extraer lógica de upload~~
- ~~`PriceTab.vue` (171 líneas) → separar concerns~~

### **FASE 3: Cobertura de Pruebas** 🟠 (Semanas 7-12)

#### 3.1 Componentes Críticos (80% cobertura requerida)
- Crear tests para todos los componentes principales
- Implementar testing library patterns consistentes
- Tests de integración para flujos complejos

#### 3.2 Mejora de Test Infrastructure
- Configurar test helpers reutilizables
- Implementar mocks consistentes para API calls
- Agregar tests de accesibilidad

### **FASE 5: Mantenibilidad a Largo Plazo** 🔵 (Semanas 17-20)

#### 5.1 Documentación Mejorada
- Documentar patrones de arquitectura
- Crear guía de contribución
- Actualizar README con mejores ejemplos

#### 5.2 CI/CD Improvements
- Implementar pre-commit hooks estrictos
- Agregar automated testing en pipeline
- Configurar dependabot para actualizaciones

#### 5.3 Monitoreo y Alertas
- Implementar error tracking (Sentry)
- Agregar analytics para UX insights
- Configurar alertas para métricas críticas

## 🎯 Métricas de Éxito

- **Cobertura de pruebas**: ≥80% (actual: 24.56%)
- **Vulnerabilidades**: 0 críticas, ≤5 altas
- **Linting**: 0 errores ✅
- **Bundle size**: Reducir 10-20%
- **Performance**: Core Web Vitals en verde ✅
- **Accesibilidad**: Puntuación ≥90 en Lighthouse ✅

## 💡 Recomendaciones Adicionales

1. **Implementar Feature Flags** para despliegues graduales
2. **Agregar Storybook** para desarrollo de componentes isolados
3. **Configurar automated deployment** con previews
4. **Implementar error boundaries** para mejor UX
5. **Agregar end-to-end tests** con Playwright para flujos críticos

## 📊 Estado Actual del Proyecto

### Métricas de Calidad
- **Cobertura de pruebas**: 24.56% (requerido: 80%)
- **Errores de linting**: 0 ✅
- **Errores TypeScript**: 0 (solo warnings en dependencias externas)
- **Vulnerabilidades**: 0 críticas ✅, ~5 altas (en dependencias transitivas)
- **Bundle size**: 540KB JS + 196KB CSS (con PWA optimizado)

### Componentes Más Grandes (Necesitan Refactorización)
1. ~~`TransferList.vue`: 269 líneas~~ → Refactorizado: `TransferPanel.vue` + composables `useTransferSelection` y `useTransferPagination`
2. ~~`ProductPhotoDialog.vue`: 225 líneas~~ → Refactorizado: composable `useImageUpload` extraído
3. ~~`PriceTab.vue`: 171 líneas~~ → Refactorizado: composables `useEntitySelection` y `useBulkSubmit` extraídos
4. `StockTab.vue`: 139 líneas → Simplificado con `useBulkSubmit`

### Código Duplicado Identificado
- ~~4 diálogos de eliminación idénticos (`*DeleteDialog.vue`)~~ → Reemplazados por `BaseDeleteDialog.vue`
- ~~Formularios CRUD con lógica repetitiva~~ → `BrandForm` y `CategoryForm` unificados en `NameOnlyForm.vue`
- Manejo de errores inconsistente

### ✅ Fases Completadas
- **FASE 1: Seguridad y Estabilidad** ✅
  - Actualizadas todas las dependencias vulnerables críticas
  - Resueltos todos los errores de linting y TypeScript
  - Implementadas reglas de accesibilidad

- **FASE 2: Calidad de Código** ✅
  - `BaseDeleteDialog.vue` genérico reemplaza 4 diálogos de eliminación duplicados
  - `NameOnlyForm.vue` unifica `BrandForm.vue` y `CategoryForm.vue` (idénticos)
  - `TransferList.vue` refactorizado: `TransferPanel.vue` + composables `useTransferSelection`/`useTransferPagination`
  - `ProductPhotoDialog.vue` simplificado: lógica extraída a `useImageUpload`
  - `PriceTab.vue` simplificado: lógica extraída a `useEntitySelection` + `useBulkSubmit`
  - `StockTab.vue` simplificado: lógica de submit extraída a `useBulkSubmit`
  - Internacionalización completa: todos los strings hardcoded convertidos a keys i18n
  - Nota: logging (2.2) omitido intencionalmente por decisión del equipo

- **FASE 4: Rendimiento y Optimización** ✅
  - Lazy loading y code splitting implementados
  - Service Worker para caching PWA
  - Core Web Vitals monitoring
  - Mejoras de accesibilidad (aria-labels, navegación)

Este documento debe actualizarse conforme se implementen las mejoras.</content>
<parameter name="filePath">IDEAS.md
