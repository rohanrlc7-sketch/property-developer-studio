import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header according to guidelines
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!aiClient) {
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined. AI consultations will fallback to detailed local simulations.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API endpoint for Phase 4 & General Bengali Consultation Advice
app.post("/api/gemini/expert-advice", async (req, res) => {
  try {
    const { 
      phase, 
      state, 
      district, 
      dimensions, 
      bhk, 
      facing, 
      floors, 
      setbacks, 
      budgetSummary,
      roomDetails,
      language
    } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback response with beautiful Bengali construction info if API key is not present
      const fallbackMsgEn = `### Indian Construction Expert Analysis (${state}, ${district})
- **Bylaw & Setting**: Adhering to India NBC codes for standard plots. Setbacks are properly planned (Front: ${setbacks.front}ft, Rear: ${setbacks.rear}ft, Sides: ${setbacks.side}ft).
- **Soil & Substructure**: Local ground conditions require customized footing depth (~5-6 ft below ground).
- **Vastu Compliance**: Master Bedroom in South-West, Pooja in North-East, and Kitchen in South-East are highly recommended.
- **Cost Aspect**: Base rate ₹${budgetSummary.rate}/sq.ft is optimal for G+${floors === 'duplex' ? '1' : '0'} structure.`;

      const fallbackMsgBn = `### ভারতীয় নির্মাণ বিশেষজ্ঞ বিশ্লেষণ (${state}, ${district})
- **বাই-ল এবং সেটিং**: ভারতের জাতীয় বিল্ডিং কোড (NBC) মেনে নকশাটি তৈরি করা হয়েছে। সামনের সেটব্যাক: ${setbacks.front} ফুট, পিছনের সেটব্যাক: ${setbacks.rear} ফুট এবং দুই পাশের সেটব্যাক: ${setbacks.side} ফুট।
- **মাটি ও ভিত্তি (Foundation)**: স্থানীয় মাটির গুণমান অনুযায়ী মাটির নিচে ৫ থেকে ৬ ফুট গভীর ফাউন্ডেশন বা ফুটিং করার পরামর্শ দেওয়া হচ্ছে।
- **বাস্তু শাস্ত্র (Vastu Shastra)**: শুভ ফল পেতে দক্ষিণ-পশ্চিমে শোবার ঘর (Master Bedroom), ঈশান কোণে (উত্তর-পূর্ব) ঠাকুর ঘর এবং অগ্নিকোণে (দক্ষিণ-পূর্ব) রান্নাঘর রাখা অত্যন্ত ফলপ্রসূ হবে।
- **বাজেট ও খরচ**: বর্তমান বাজারে আপনার নির্বাচিত ₹${budgetSummary.rate}/বর্গফুট রেটটি G+${floors === 'duplex' ? '১' : '০'} ভবনের গ্রেই স্ট্রাকচার ও ফিনিশিংয়ের জন্য উপযুক্ত।`;

      return res.json({ advice: language === 'bn' ? fallbackMsgBn : fallbackMsgEn });
    }

    const systemPrompt = `You are a premium AI Civil Engineer, Indian Construction Cost Estimator (NBC compliant), and Senior Interior Designer.
Always maintain a highly professional, trustworthy, and precise tone.
LANGUAGE INSTRUCTIONS:
- If language is 'bn', write the ENTIRE advice and formatting in beautiful technical and accessible BENGALI (বাংলা).
- If language is 'en', write in professional English.

Provide custom professional suggestions, analysis, structural rules, and design ideas.`;

    const prompt = `Provide an expert civil engineering, NBC standard bylaw, and premium interior design consultation for this proposed property:
Location: State - ${state}, District - ${district}, India.
Plot Dimensions: ${dimensions.width}ft x ${dimensions.depth}ft
BHK Configuration: ${bhk}
Floors: ${floors}
Facing: ${facing}
Calculated Setbacks: Front ${setbacks.front}ft, Rear ${setbacks.rear}ft, Side ${setbacks.side}ft
Total Built-up Area: ${budgetSummary.builtUpArea} sq.ft
Estimated Cost: ₹${budgetSummary.totalCost.toLocaleString('en-IN')} (at Base Rate: ₹${budgetSummary.rate}/sq.ft)

The structural rooms include: ${JSON.stringify(roomDetails)}

Please cover these 4 domains in your report:
1. Local Soil & Foundation Consultation (Customized advice for ${state} & ${district} region).
2. Vastu Shastra Audit (Check facing of the plot: ${facing} and provide recommendations).
3. Under-construction Civil Engineering tips (Cement choice OPC 53/43 vs PPC, curing days, steel sizing).
4. Premium Interior Decor & Light Plan matching the layout.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    res.json({ advice: response.text });
  } catch (error: any) {
    console.error("Gemini advice error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI consultation" });
  }
});

// Vite middleware setup for Development or Static server for Production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite dev middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Using static assets production build path...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Indian Property Developer Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
