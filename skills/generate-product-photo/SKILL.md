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
1.  **Quitar Fondo**: La imagen original se procesa para eliminar el fondo usando `src/lib/background-removal.ts`.
2.  **Analizar Producto**: Se usa Gemini (`src/lib/ai/gemini.ts`) para entender qué es el objeto.
3.  **Generar Prompt**: Se usa Cerebras (`src/lib/ai/cerebras.ts`) para crear un prompt creativo basado en un estilo.
4.  **Generar Nueva Imagen**: Se usa el modelo de inpainting (`src/lib/ai/image-gen.ts`) para fusionar el objeto sin fondo con un nuevo entorno.

## Instrucciones
- Mantener la integridad visual del producto original siempre (no alucinar el producto).
- Usar el hook `useImageProcessor` como la fuente de verdad para la orquestación.
- Los estilos deben ser definidos en la interfaz de usuario pero procesados por el backend/hook.

## Recursos
- `src/hooks/useImageProcessor.ts`: Lógica principal.
