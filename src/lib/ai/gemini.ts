import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey || "");

export async function analyzeProductImage(imageFile: File): Promise<string> {
    if (!apiKey) {
        if (process.env.NODE_ENV === 'development') {
            // Allow mock in dev if no key
            console.warn("Gemini API Key missing, returning mock description");
            return "Una zapatilla deportiva roja con suela blanca, estilo runner.";
        }
        throw new Error("Gemini API Key not found");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert File to Base64 (Browser compatible)
    const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = () => {
            const result = reader.result as string;
            // Remove data URL prefix (e.g. "data:image/jpeg;base64,")
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
    });

    try {
        const result = await model.generateContent([
            "Eres un experto en fotografía de productos y branding. Analiza esta imagen y describe DETALLADAMENTE el producto principal. Ignora el fondo si es simple. Describe: 1. Qué es (Zapatilla, Botella, etc). 2. Material (Cuero, Vidrio, etc). 3. Colores principales. 4. Detalles distintivos (Logos, textos visibles). Responde en un solo párrafo conciso pero rico en detalles visuales.",
            {
                inlineData: {
                    data: base64String,
                    mimeType: imageFile.type,
                },
            },
        ]);

        const response = await result.response;
        return response.text();
    } catch (e) {
        console.error("Gemini Error:", e);
        throw e;
    }
}
