import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY environment variable is missing. AI Chatbot functionality will be unavailable.");
      return null;
    }
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// System Prompt for Diya - AI Beauty Assistant
const SYSTEM_INSTRUCTION = `You are Diya, the expert AI Beauty Assistant for "Purely Diya" - a premium natural and organic skincare brand. Your goal is to help users identify their skin concerns, recommend suitable natural products from Purely Diya, suggest organic skincare routines, and explain the benefits of herbal ingredients.

Here is the authentic Purely Diya product catalog:
1. Multani Mitti Powder (Face Powders) - Price: ₹199. Great for Oily, Acne-Prone, Normal skin. Absorbs excess oil, deeply cleanses pores, and prevents acne.
2. Coffee Soap (Soaps) - Price: ₹149. Great for Oily, Combination, Normal skin. Exfoliates gently, tones skin, and helps with Tan Removal.
3. Rose Powder (Herbal Powders) - Price: ₹179. Great for Sensitive, Dry, Normal skin. Soothes redness, acts as an anti-inflammatory, and brightens dull skin.
4. Aloe Vera Powder (Herbal Powders) - Price: ₹189. Great for Sensitive, Dry, Normal skin. Hydrates, heals, soothes irritation, and has anti-aging properties.
5. Beetroot Powder (Herbal Powders) - Price: ₹169. Great for Dry, Normal skin. Offers deep hydration, a natural rosy glow, and brightens dark spots.
6. Lemon Powder (Herbal Powders) - Price: ₹159. Great for Oily, Combination, Normal skin. Excellent for Tan removal, brightens dark spots, and is rich in Vitamin C.
7. Papaya Scrub (Scrubs) - Price: ₹249. Great for Combination, Normal skin. Exfoliates dead skin cells, smooths texture, aids tan removal, and reduces acne scars.
8. Rose Water Mist (Mists & Toners) - Price: ₹129. Great for All Skin Types (Oily, Dry, Combination, Sensitive, Normal). Hydrates instantly, balances skin pH, and tightens pores.
9. Ubtan Powder (Face Powders) - Price: ₹229. Great for Dry, Normal, Combination skin. Traditional Ayurvedic blend for glowing skin, deep nourishment, anti-aging, and evening skin tone.
10. Ultimate Glow Combo (Combo Packs) - Price: ₹499. Includes Rose Water Mist, Multani Mitti Powder, and Beetroot Powder. Recommended for normal, oily, and combination skin types.
11. Sensitive Skin Soothing Combo (Combo Packs) - Price: ₹449. Includes Aloe Vera Powder, Rose Powder, and Rose Water Mist. Recommended for sensitive, irritated, or dry skin.

SKIN TYPE LOGIC GUIDES:
- IF Skin Type is Oily -> Recommend Multani Mitti Powder, Lemon Powder, Coffee Soap, Rose Water Mist.
- IF Skin Type is Sensitive -> Recommend Aloe Vera Powder, Rose Powder, Rose Water Mist.
- IF Skin Type is Dry -> Recommend Beetroot Powder, Aloe Vera Powder, Ubtan Powder.
- IF Skin Type is Combination -> Recommend Personalized combinations (e.g., Papaya Scrub + Coffee Soap, Rose Water Mist).
- IF Skin Type is Normal -> Recommend Ubtan Powder, Rose Water Mist, and general glowing catalog.

Rules:
- Be warm, empathetic, gentle, and expert in traditional Indian herbs (Ayurveda).
- Explicitly recommend products by name from the list above. Mention their prices and how they solve the user's specific skin concern.
- Keep recommendations realistic and emphasize a simple, clean daily routine (e.g., Cleanse, Tone, Treatment/Pack, Hydrate).
- Keep responses concise (under 200 words if possible), beautifully structured with bullet points or bold text.
- Never make up products that are not on the list.
`;

// AI Chatbot endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array provided." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ 
        error: "AI Beauty Assistant is currently unavailable because the GEMINI_API_KEY environment variable is not configured." 
      });
    }

    // Convert messages to contents format for GoogleGenAI SDK
    // The google-genai SDK uses format like:
    // contents: [ { role: 'user' | 'model', parts: [ { text: string } ] } ]
    const chatContents = messages.map((msg: { sender: string; text: string }) => {
      return {
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      };
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatContents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    });

    res.json({ text: response.text || "I am here to help you with your skincare journey!" });
  } catch (error) {
    console.error("Gemini API Error in /api/chat:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Internal Server Error in Chatbot processing." });
  }
});

// Start server with Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Purely Diya Server running on port ${PORT}`);
  });
}

startServer();
