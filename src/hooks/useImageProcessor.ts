"use client";

import { useState } from 'react';
import { removeImageBackground } from '../lib/background-removal';
// We remove direct AI imports as they will be handled by the backend

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

    const processItem = async (file: File, userDescription: string, basePrompt: string) => {
        const id = Math.random().toString(36).substr(2, 9);

        // Init Item
        setItems(prev => [...prev, { id, originalFile: file, status: 'removing_bg', description: userDescription }]);

        try {
            // 1. Remove Background
            const noBgBlob = await removeImageBackground(file);
            setItems(prev => prev.map(item => item.id === id ? { ...item, noBgBlob, status: 'analyzing' } : item));

            // 2. Process via Backend API (Analysis, Prompting, Generation)
            // Convert file to base64 for API
            const imageBase64 = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });

            setItems(prev => prev.map(item => item.id === id ? { ...item, status: 'analyzing' } : item));

            const response = await fetch('/api/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageBase64,
                    userDescription,
                    basePrompt
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to process image");
            }

            const data = await response.json();

            // Convert back to Blob for UI compatibility
            const finalImage = await (await fetch(data.finalImageBase64)).blob();

            setItems(prev => prev.map(item => item.id === id ? {
                ...item,
                finalImage,
                prompts: data.prompts,
                status: 'completed'
            } : item));

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
