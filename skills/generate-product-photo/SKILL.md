---
name: generate-product-photo
description: Procesa imágenes de productos para generar fotos de marketing estilizadas. Úsese cuando el usuario quiera transformar una foto de producto simple en una imagen publicitaria.
---

# Generación de Fotos de Producto con IA

## Cuándo usar esta habilidad
- El usuario sube una imagen de un producto y quiere "mejorarla" o "cambiar el fondo".
- El usuario pide generar descripciones o prompts de marketing para un producto.
- El usuario quiere procesar un lote de imágenes.

## Flujo de trabajo
1.  **Quitar Fondo**: RMBG procesa la imagen para eliminar el fondo.
2.  **Analizar Producto**: Gemini identifica detalles técnicos (IA Description).
3.  **Generar Prompt**: Cerebras fusiona el **Prompt Base (estilo)**, la **Descripción del Usuario** y el **Análisis de IA**.
4.  **Generar Nueva Imagen**: El modelo de inpainting coloca el producto en el nuevo escenario.

## Instrucciones
- Mantener la integridad visual del producto original siempre (no alucinar el producto).
- Usar el hook `useImageProcessor` como la fuente de verdad para la orquestación.
- Los estilos deben ser definidos en la interfaz de usuario pero procesados por el backend/hook.

## Recursos
- `src/hooks/useImageProcessor.ts`: Lógica principal.
