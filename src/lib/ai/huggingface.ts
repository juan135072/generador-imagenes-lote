/**
 * Hugging Face API Integration for Image Generation
 * Model: FLUX.1 [schnell]
 */

export async function generateImage(prompt: string): Promise<string> {
    const apiToken = process.env.HF_TOKEN ||
        process.env.NEXT_PUBLIC_HF_TOKEN ||
        process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY ||
        process.env.NEXT_PUBLIC_HUGGINFACE_API_KEY; // Matching user's screenshot spelling

    if (!apiToken) {
        throw new Error("Hugging Face API Token is missing");
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

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        return `data:image/png;base64,${base64}`;
    } catch (error) {
        console.error("Error generating image with FLUX:", error);
        throw error;
    }
}
