# IDEAS.md - Propuestas de Mejora

Este documento contiene propuestas de mejora identificadas durante el análisis del proyecto Dead Simple Inventory Manager Frontend.

## 🚨 Problemas Críticos Identificados

### 1. **Cobertura de Pruebas Muy Baja** (24.56% vs 80% requerido)
- **Problema**: Solo los servicios, stores y utils tienen buena cobertura. Todos los componentes Vue tienen 0% cobertura.
- **Impacto**: Alto riesgo de bugs en producción, especialmente en la UI.

### 2. **Vulnerabilidades de Seguridad Críticas**
- **Problema**: 1 crítica (happy-dom), múltiples altas (vue-i18n, rollup, minimatch, etc.)
- **Impacto**: Riesgos de ejecución remota de código, XSS, y otras vulnerabilidades.

### 3. **Errores de Linting y TypeScript**
- **Problema**: 5 errores ESLint en tests, errores TypeScript en Vite plugin
- **Impacto**: Calidad de código inconsistente, posibles errores en runtime.

## 📋 Plan de Mejoras Priorizadas

### **FASE 1: Seguridad y Estabilidad** 🔴 (Semanas 1-2)

#### 1.1 Actualizar Dependencias Vulnerables
```bash
# Actualizar paquetes críticos
pnpm update vue-i18n@^10.0.8
pnpm update happy-dom@^20.0.0
pnpm update rollup@^4.59.0
pnpm update minimatch@^9.0.7
pnpm update node-forge@^1.3.2
pnpm update serialize-javascript@^7.0.3
```

#### 1.2 Resolver Errores de Linting
- Arreglar los 5 errores en `src/utils/__tests__/image.test.ts`
- Implementar reglas de accesibilidad faltantes

#### 1.3 Corregir Errores TypeScript
- Resolver incompatibilidad de versiones en Vite plugin
- Actualizar `@vitejs/plugin-vue` si es necesario

### **FASE 2: Calidad de Código** 🟡 (Semanas 3-6)

#### 2.1 Eliminar Código Duplicado
- Crear componente base `BaseDeleteDialog.vue` para eliminar duplicación en 4 diálogos
- Extraer lógica común de formularios CRUD

#### 2.2 Mejorar Logging
- Reemplazar `console.error` con logger estructurado
- Implementar niveles de log apropiados

#### 2.3 Internacionalización Completa
- Convertir strings hardcoded como `label="Stock"` a keys i18n
- Auditar todos los componentes para strings no traducidos

#### 2.4 Refactorizar Componentes Grandes
- `TransferList.vue` (269 líneas) → dividir en componentes más pequeños
- `ProductPhotoDialog.vue` (225 líneas) → extraer lógica de upload
- `PriceTab.vue` (171 líneas) → separar concerns

### **FASE 3: Cobertura de Pruebas** 🟠 (Semanas 7-12)

#### 3.1 Componentes Críticos (80% cobertura requerida)
- Crear tests para todos los componentes principales
- Implementar testing library patterns consistentes
- Tests de integración para flujos complejos

#### 3.2 Mejora de Test Infrastructure
- Configurar test helpers reutilizables
- Implementar mocks consistentes para API calls
- Agregar tests de accesibilidad

### **FASE 4: Rendimiento y Optimización** 🟢 (Semanas 13-16)

#### 4.1 Optimización de Bundle
- Implementar lazy loading para rutas
- Code splitting por features
- Tree shaking optimization

#### 4.2 Accesibilidad Mejorada
- Agregar aria-labels apropiados
- Soporte para navegación por teclado
- Implementar landmarks semánticos

#### 4.3 Performance Monitoring
- Agregar métricas de Core Web Vitals
- Implementar service worker para caching
- Optimizar imágenes y assets

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
- **Linting**: 0 errores
- **Bundle size**: Reducir 10-20%
- **Performance**: Core Web Vitals en verde
- **Accesibilidad**: Puntuación ≥90 en Lighthouse

## 💡 Recomendaciones Adicionales

1. **Implementar Feature Flags** para despliegues graduales
2. **Agregar Storybook** para desarrollo de componentes isolados
3. **Configurar automated deployment** con previews
4. **Implementar error boundaries** para mejor UX
5. **Agregar end-to-end tests** con Playwright para flujos críticos

## 📊 Estado Actual del Proyecto

### Métricas de Calidad
- **Cobertura de pruebas**: 24.56% (requerido: 80%)
- **Errores de linting**: 5
- **Errores TypeScript**: Varios en dependencias
- **Vulnerabilidades**: 1 crítica + múltiples altas
- **Bundle size**: 531KB JS + 196KB CSS

### Componentes Más Grandes (Necesitan Refactorización)
1. `TransferList.vue`: 269 líneas
2. `ProductPhotoDialog.vue`: 225 líneas
3. `PriceTab.vue`: 171 líneas
4. `StockTab.vue`: 139 líneas

### Código Duplicado Identificado
- 4 diálogos de eliminación idénticos (`*DeleteDialog.vue`)
- Formularios CRUD con lógica repetitiva
- Manejo de errores inconsistente

Este documento debe actualizarse conforme se implementen las mejoras.</content>
<parameter name="filePath">IDEAS.md