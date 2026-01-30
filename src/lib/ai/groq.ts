/**
 * Groq API Integration for Image Analysis
 * Model: llama-3.2-11b-vision-preview
 */

export async function analyzeProductImage(base64Image: string): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

    if (!apiKey) {
        throw new Error("Groq API Key (NEXT_PUBLIC_GROQ_API_KEY) is missing");
    }

    // Ensure the base64 string doesn't include the data:image prefix if present
    const base64Data = base64Image.includes(",") ? base64Image.split(",")[1] : base64Image;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.2-11b-vision-preview",
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "Describe this product image in detail for a professional photography prompt. Focus on: product type, materials, color shades, presence of logos, textures, and shape. Be technical and precise. Return ONLY the description, no conversational text."
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${base64Data}`
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 300
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Groq API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || "No description generated.";
    } catch (error) {
        console.error("Error analyzing image with Groq:", error);
        throw error;
    }
}
