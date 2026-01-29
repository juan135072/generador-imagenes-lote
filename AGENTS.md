# AGENTS.md

> **AI Product Photo Generator**
> Simple coding agent guidelines for this Next.js project.

## Project Overview
This is a Next.js application that autonomously generates professional product photos from raw uploads.
- **Stack**: Next.js 15+, Tailwind CSS v3, TypeScript.
- **AI Stack**: Google Gemini (Analysis), Cerebras (Prompting), ImgLy (Background Removal), Inpainting (Image Gen).

## Folder Structure
- `src/app`: App Router pages and API routes.
- `src/components`: React UI components.
- `src/lib`: Core logic and helper functions (AI clients, image processing).
- `src/hooks`: React hooks (state management).
- `skills/`: Agentic skills defined for this project.

## Setup Commands
- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build for production: `npm run build`

## Code Style
- **Framework**: Use React Server Components by default; add `'use client'` only when necessary.
- **Styling**: Tailwind CSS classes. Avoid CSS Modules unless critical.
- **Types**: Strict TypeScript. No `any`.
- **Naming**: `PascalCase` for components, `camelCase` for functions/variables.

## Key Files
- `src/hooks/useImageProcessor.ts`: Orchestrates the entire AI pipeline logic.
- `src/lib/ai/gemini.ts`: Handles product image analysis.
- `src/lib/ai/cerebras.ts`: Generates creative prompts.
- `src/lib/background-removal.ts`: Handles client-side background removal.
