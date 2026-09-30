// src/services/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getStockRedistributionPlan(targetPHC, allPHCs) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey || apiKey.trim() === "" || apiKey === "your_api_key_here") {
        throw new Error(
            "Gemini API key missing! Please add VITE_GEMINI_API_KEY in .env.local and restart the dev server."
        );
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey.trim());
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" },
        });

        const prompt = `Analyze stock redistribution for target PHC: ${JSON.stringify(targetPHC)} against all PHCs: ${JSON.stringify(allPHCs)}. Return JSON with urgencyLevel, summary, and recommendedTransfers array.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        return JSON.parse(responseText);
    } catch (error) {
        console.error("Gemini API Error:", error);

        if (
            error.message?.includes("Method doesn't allow unregistered callers") ||
            error.message?.includes("API key not valid") ||
            error.status === 403
        ) {
            throw new Error(
                "Invalid or unregistered Gemini API Key (403). Please verify your key at https://aistudio.google.com/app/apikey and update .env.local."
            );
        }

        throw error;
    }
}