import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_CEREBRAS_API_KEY,
    baseURL: "https://api.cerebras.ai/v1",
    dangerouslyAllowBrowser: true // Client-side demo allow
});

export async function generateCreativePrompt(productDescription: string, brandStyle: string): Promise<{ positive: string, negative: string }> {
    if (!process.env.NEXT_PUBLIC_CEREBRAS_API_KEY) {
        console.warn("Cerebras API Key missing");
        return {
            positive: `Product photography of ${productDescription} in ${brandStyle} style`,
            negative: "low quality"
        };
    }

    const systemPrompt = `Eres un Prompt Engineer experto en Stable Diffusion y FLUX.1.
Tu trabajo es escribir prompts para generar fondos publicitarios de alta calidad para productos.
El usuario te dará una DESCRIPCIÓN DEL PRODUCTO y un ESTILO DE MARCA.
Debes devolver un JSON con dos campos:
- "positive": El prompt positivo. DEBE INCLUIR términos de iluminación profesional (soft lighting, studio lighting), calidad (8k, hdr) y describir el escenario basado en el estilo.
- "negative": Prompt negativo.`;

    try {
        const completion = await client.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Producto: ${productDescription}\nEstilo: ${brandStyle}` }
            ],
            model: 'llama3.1-70b',
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("No content from Cerebras");

        return JSON.parse(content);
    } catch (error) {
        console.error("Cerebras Error:", error);
        return {
            positive: `${brandStyle} background for ${productDescription}, professional photography, 8k, soft shadows`,
            negative: "ugly, blurry, low quality"
        };
    }
}
