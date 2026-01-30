/**
 * Hugging Face API Integration for Image Generation
 * Model: FLUX.1 [schnell]
 */

export async function generateImage(prompt: string): Promise<string> {
    const apiToken = process.env.NEXT_PUBLIC_HF_TOKEN;

    if (!apiToken) {
        throw new Error("Hugging Face API Token (NEXT_PUBLIC_HF_TOKEN) is missing");
    }

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
            {
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Hugging Face API Error: ${errorData.error || response.statusText}`);
        }

        const blob = await response.blob();

        // Convert Blob to Base64 for easier usage in the frontend
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Error generating image with FLUX:", error);
        throw error;
    }
}
