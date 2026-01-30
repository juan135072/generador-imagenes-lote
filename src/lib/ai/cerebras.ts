import OpenAI from 'openai';

// Lazy initialize client to avoid build-time errors when API key is missing
let client: OpenAI | null = null;

const getClient = () => {
    if (client) return client;
    client = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_CEREBRAS_API_KEY || 'no-key-at-build-time',
        baseURL: "https://api.cerebras.ai/v1",
        dangerouslyAllowBrowser: true
    });
    return client;
};

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
        const completion = await getClient().chat.completions.create({
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
