// Do NOT use: import { pipeline } from "@xenova/transformers";
// Instead use dynamic import from the browser build
let pipeline: any;

export async function getAIResponse(prompt: string): Promise<string> {
    if (!pipeline) {
        // Dynamically import the browser build
        const transformers = await import("@xenova/transformers");
        pipeline = transformers.pipeline;
    }

    const generator = await pipeline("text-generation", "Xenova/distilgpt2");

    const output = await generator(prompt, {
        max_new_tokens: 60,
        temperature: 0.7,
    });

    return output[0].generated_text;
}
