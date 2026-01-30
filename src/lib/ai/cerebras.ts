import OpenAI from 'openai';

// Lazy initialize client to avoid build-time errors when API key is missing
let client: OpenAI | null = null;

const getClient = () => {
    if (client) return client;
    client = new OpenAI({
        apiKey: process.env.CEREBRAS_API_KEY || process.env.NEXT_PUBLIC_CEREBRAS_API_KEY || 'no-key-at-build-time',
        baseURL: "https://api.cerebras.ai/v1",
    });
    return client;
};

export async function generateCreativePrompt(
    aiDescription: string,
    userDescription: string,
    basePrompt: string
): Promise<{ positive: string, negative: string }> {
    const key = process.env.CEREBRAS_API_KEY || process.env.NEXT_PUBLIC_CEREBRAS_API_KEY;
    if (!key) {
        console.warn("Cerebras API Key missing");
        return {
            positive: `${basePrompt}, featuring ${userDescription}`,
            negative: "low quality"
        };
    }

    const systemPrompt = `Eres un Prompt Engineer experto en Stable Diffusion y FLUX.1.
Tu trabajo es crear el prompt de imagen FINAL fusionando tres componentes:
1. BASE PROMPT: La guía de estilo y escenario general definida por el usuario.
2. USER DESCRIPTION: Lo que el usuario dice que es el producto.
3. AI ANALYSIS: Detalles técnicos identificados por la IA (materiales, colores, logos).

Debes devolver un JSON con:
- "positive": Un prompt en INGLÉS altamente detallado que ponga el producto en el escenario del BASE PROMPT. 
- "negative": Prompt negativo estándar.

IMPORTANTE: El producto debe ser el foco central. No modifiques el producto, solo el entorno.`;

    try {
        const completion = await getClient().chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `BASE PROMPT: ${basePrompt}\nUSER DESCRIPTION: ${userDescription}\nAI ANALYSIS: ${aiDescription}` }
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
            positive: `${basePrompt}, ${userDescription}, professional photography, studio lighting`,
            negative: "ugly, blurry, low quality"
        };
    }
}
