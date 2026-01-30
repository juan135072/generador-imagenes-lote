import { removeBackground } from "@imgly/background-removal";

export interface ProcessedImage {
    originalFile: File;
    processedBlob: Blob;
    maskBlob?: Blob; // Future proofing for inpainting mask
}

export async function removeImageBackground(imageFile: File): Promise<Blob> {
    try {
        // Check for secure context (HTTPS or localhost)
        if (typeof window !== 'undefined' && !window.isSecureContext) {
            throw new Error("La eliminación de fondo requiere una conexión segura (HTTPS). Por favor, usa un dominio con SSL.");
        }

        // imgly runs entirely in the browser using WASM
        const msg = "Removing background...";
        console.time(msg);

        // Config: we can pass a URL or File
        // publicPath is important if we host the wasm files locally, but default works via CDN usually.
        // For production, we might need to copy wasm files to public/
        // See: https://github.com/imgly/background-removal-js

        const blob = await removeBackground(imageFile, {
            progress: (key, current, total) => {
                // console.log(`Downloading ${key}: ${current} of ${total}`);
            },
            debug: false
        });

        console.timeEnd(msg);
        return blob;
    } catch (error) {
        console.error("Error removing background:", error);
        throw error;
    }
}
