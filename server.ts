import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "Postly Studio" });
});

// API: Generate Quotes & Post Copy
app.post("/api/gemini/generate-quote", async (req, res) => {
  try {
    const { category, language = "pt", customTopic, count = 4 } = req.body;
    const ai = getGeminiClient();

    const prompt = `Generate ${count} engaging, inspirational social media quotes or post statements.
Category / Mood: ${category || "Inspirational"}
Custom Topic / Keywords: ${customTopic || "None"}
Language: ${language === "pt" ? "Portuguese (Brazil/Portugal)" : language === "es" ? "Spanish" : "English"}

Requirements:
- Make quotes memorable, impactful, concise (15-40 words each), perfect for social media quote cards (like DudoPost).
- Provide an attribution author/tag (e.g., "Sêneca", "Pensamento do Dia", "Mindset Milionário", "Sabedoria Diária", "Autor Desconhecido").
- Output pure valid JSON array.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              quote: { type: Type.STRING, description: "The quote or post body text" },
              author: { type: Type.STRING, description: "Author or source tag" },
              category: { type: Type.STRING, description: "Subcategory or mood tag" },
            },
            required: ["quote", "author"],
          },
        },
      },
    });

    const quotes = JSON.parse(response.text || "[]");
    res.json({ success: true, quotes });
  } catch (err: any) {
    console.error("Error generating quotes:", err);
    res.status(500).json({ error: err.message || "Failed to generate quotes" });
  }
});

// API: Generate Captions and Hashtags
app.post("/api/gemini/generate-caption", async (req, res) => {
  try {
    const { postText, platform = "Instagram", language = "pt" } = req.body;
    const ai = getGeminiClient();

    const prompt = `Create 3 engaging social media caption variations with relevant hashtags for a post with this text or topic:
Post content: "${postText}"
Target Platform: ${platform}
Language: ${language === "pt" ? "Portuguese" : language === "es" ? "Spanish" : "English"}

Provide captions formatted with hooks, main text, emojis, call to action, and 10-15 trending relevant hashtags.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            captions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  style: { type: Type.STRING, description: "e.g. Engaging, Minimalist, Storytelling" },
                  text: { type: Type.STRING, description: "Complete caption text with emoji and linebreaks" },
                  hashtags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "List of hashtags without #"
                  }
                },
                required: ["style", "text", "hashtags"]
              }
            }
          },
          required: ["captions"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json({ success: true, ...data });
  } catch (err: any) {
    console.error("Error generating caption:", err);
    res.status(500).json({ error: err.message || "Failed to generate caption" });
  }
});

// API: AI Design Assistant & Styling Theme Generator
app.post("/api/gemini/generate-design-theme", async (req, res) => {
  try {
    const { text } = req.body;
    const ai = getGeminiClient();

    const prompt = `Analyze this quote/post text and suggest a visually stunning design theme palette for a social media post card:
Text: "${text}"

Suggest color hex codes, background gradient style, font pairing recommendations, and accent overlay style.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            themeName: { type: Type.STRING },
            bgColor1: { type: Type.STRING, description: "Primary hex color, e.g. #0f172a" },
            bgColor2: { type: Type.STRING, description: "Secondary hex color for gradient, e.g. #3b82f6" },
            textColor: { type: Type.STRING, description: "Main text hex color, e.g. #ffffff" },
            accentColor: { type: Type.STRING, description: "Accent/author hex color, e.g. #f59e0b" },
            fontPair: { type: Type.STRING, description: "e.g. Serif / Modern Sans" },
            vibe: { type: Type.STRING, description: "e.g. Dark Luxury, Cyberpunk, Soft Warm Cream, Emerald Business" },
          },
          required: ["themeName", "bgColor1", "bgColor2", "textColor", "accentColor"]
        }
      }
    });

    const theme = JSON.parse(response.text || "{}");
    res.json({ success: true, theme });
  } catch (err: any) {
    console.error("Error generating theme:", err);
    res.status(500).json({ error: err.message || "Failed to generate theme" });
  }
});

// API: Rephrase & Enhance Text
app.post("/api/gemini/rephrase", async (req, res) => {
  try {
    const { text, style = "Inspirational", language = "pt" } = req.body;
    const ai = getGeminiClient();

    const prompt = `Rewrite this text into 3 distinct improved variations for social media post graphics:
Original: "${text}"
Target Tone: ${style}
Language: ${language === "pt" ? "Portuguese" : language === "es" ? "Spanish" : "English"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              tone: { type: Type.STRING },
              rephrased: { type: Type.STRING }
            },
            required: ["tone", "rephrased"]
          }
        }
      }
    });

    const variations = JSON.parse(response.text || "[]");
    res.json({ success: true, variations });
  } catch (err: any) {
    console.error("Error rephrasing text:", err);
    res.status(500).json({ error: err.message || "Failed to rephrase text" });
  }
});

// Vite Middleware & Static Serving setup
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
    console.log(`Postly Studio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
