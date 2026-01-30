import { NextRequest, NextResponse } from "next/server";
import { analyzeProductImage } from "@/lib/ai/groq";
import { generateCreativePrompt } from "@/lib/ai/cerebras";
import { generateImage } from "@/lib/ai/huggingface";

export async function POST(req: NextRequest) {
    try {
        const { imageBase64, userDescription, basePrompt } = await req.json();

        if (!imageBase64) {
            return NextResponse.json({ error: "Image data is required" }, { status: 400 });
        }

        // 1. Analyze (Groq)
        console.log("Analyzing image...");
        const aiDescription = await analyzeProductImage(imageBase64);

        // 2. Prompt (Cerebras)
        console.log("Generating prompt...");
        const prompts = await generateCreativePrompt(aiDescription, userDescription, basePrompt);

        // 3. Generate (Hugging Face)
        console.log("Generating final image...");
        const finalImageBase64 = await generateImage(prompts.positive);

        return NextResponse.json({
            success: true,
            finalImageBase64,
            prompts,
            aiDescription
        });

    } catch (error: any) {
        console.error("API Processing Error:", error);
        return NextResponse.json({
            error: error.message || "Internal Server Error"
        }, { status: 500 });
    }
}
