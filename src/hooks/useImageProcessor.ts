"use client";

import { useState } from 'react';
import { removeImageBackground } from '../lib/background-removal';
import { analyzeProductImage } from '../lib/ai/gemini';
import { generateCreativePrompt } from '../lib/ai/cerebras';
import { generateBackground } from '../lib/ai/image-gen';

export type ProcessStatus = 'idle' | 'removing_bg' | 'analyzing' | 'prompting' | 'generating' | 'completed' | 'error';

export interface ProcessedItem {
    id: string;
    originalFile: File;
    noBgBlob?: Blob;
    description?: string;
    prompts?: { positive: string, negative: string };
    finalImage?: Blob;
    status: ProcessStatus;
    error?: string;
}

export function useImageProcessor() {
    const [items, setItems] = useState<ProcessedItem[]>([]);

    const processItem = async (file: File, brandStyle: string) => {
        const id = Math.random().toString(36).substr(2, 9);

        // Init Item
        setItems(prev => [...prev, { id, originalFile: file, status: 'removing_bg' }]);

        try {
            // 1. Remove Background
            const noBgBlob = await removeImageBackground(file);
            setItems(prev => prev.map(item => item.id === id ? { ...item, noBgBlob, status: 'analyzing' } : item));

            // 2. Analyze Product (Gemini)
            const description = await analyzeProductImage(file);
            setItems(prev => prev.map(item => item.id === id ? { ...item, description, status: 'prompting' } : item));

            // 3. Generate Prompt (Cerebras)
            const prompts = await generateCreativePrompt(description, brandStyle);
            setItems(prev => prev.map(item => item.id === id ? { ...item, prompts, status: 'generating' } : item));

            // 4. Generate Image (Flux/Inpainting)
            const finalImage = await generateBackground(noBgBlob, prompts.positive);
            setItems(prev => prev.map(item => item.id === id ? { ...item, finalImage, status: 'completed' } : item));

        } catch (error: any) {
            console.error("Processing chain failed:", error);
            setItems(prev => prev.map(item => item.id === id ? { ...item, status: 'error', error: error.message } : item));
        }
    };

    return {
        items,
        processItem
    };
}
