import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini client to handle missing API keys gracefully without crashing on boot
let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY environment variable is not configured in Secrets.");
    }
    geminiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// System Instruction that sets up our Daily Needs store context
const SYSTEM_INSTRUCTION = `
You are the AI Shopping Assistant for "Daily Needs", a premium fictional grocery e-commerce store in Bhopal, India.
Your tone is friendly, knowledgeable, welcoming, and helpful. You should write clear, concise answers formatted beautifully in Markdown (with bolding, bullets, and lists where appropriate).

Daily Needs Details:
- Store Owner: Rajesh Sharma
- Contact Phone / WhatsApp: +91 9876543210
- Email: support@dailyneeds.in
- Store Address: 123 Main Market, Bhopal, Madhya Pradesh, India
- Timings: 7:00 AM – 10:00 PM (Every day)
- Delivery Speed: 20–45 Minutes (Express)
- Delivery Radius: 10 KM from the store
- Business Rules:
  * Minimum Order Value: ₹1,000 (Checkout is disabled below this amount)
  * Delivery Fee: ₹100 for orders under ₹2,000
  * Free Delivery: Available for all orders above ₹2,000
  * Payment Options: Cash on Delivery (COD) and instant UPI payments

We offer premium products in these 20 Categories:
1. Rice
2. Atta
3. Pulses
4. Oils
5. Spices
6. Tea
7. Coffee
8. Sugar
9. Salt
10. Snacks
11. Chocolates
12. Beverages
13. Frozen Food
14. Dry Fruits
15. Personal Care
16. Baby Care
17. Cleaning Supplies
18. Kitchen Essentials
19. Pet Care
20. Stationery

Your Capabilities:
1. Recommend products based on user descriptions, diet, health goals, or family size.
2. Search grocery products conceptually (e.g. "something healthy for breakfast", "cleaning items").
3. Suggest simple recipes (e.g. Dal Tadka, Kheer, Pasta, French Fries) and lists the ingredients that are available at Daily Needs.
4. Answer Frequently Asked Questions about delivery, refund policies, and business hours.
5. Offer smart shopping cart optimization and encourage adding items to hit ₹1000 for checkout or ₹2000 for free shipping!
6. Tell users about active coupons like DAILY10, SUPERNEEDS, WELCOME50, and FREESHIP.

If the user asks about an item or category we don't carry (e.g., electronic items, high-end laptops, clothing), politely remind them that Daily Needs focuses on delivering the freshest, highest quality groceries, household essentials, and stationery items straight to their door in 30 minutes.

Always offer helpful, warm Indian hospitality!
`;

// AI Assistant endpoint
app.post("/api/assistant", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      res.status(400).json({ error: "Message is required." });
      return;
    }

    let client: GoogleGenAI;
    try {
      client = getGeminiClient();
    } catch (keyError: any) {
      // Graceful response if Gemini API key is missing
      res.json({
        reply: `### Welcome to Daily Needs AI Assistant! 👋\n\nI am here to help you find fresh products, offer tasty recipes, and assist with your grocery shopping.\n\n*Note: To enable active Gemini AI suggestions, please add your valid \`GEMINI_API_KEY\` in **Settings > Secrets** panel in AI Studio. Currently, I am running in demo mode!*\n\nHow can I help you today? You can ask me things like:\n- "Suggest a simple recipe for Dinner"\n- "What is the delivery radius?"\n- "What are the current offers and coupons?"`,
        demo: true
      });
      return;
    }

    // Format history for Gemini chat if present, otherwise do generateContent
    // Let's use standard generateContent with structured prompt for simplicity and robustness
    const formattedContents = [];
    if (history && Array.isArray(history)) {
      for (const h of history) {
        formattedContents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        });
      }
    }
    // Add current user message
    formattedContents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents as any,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    res.json({
      reply: response.text || "I apologize, but I could not formulate a response. Please try again.",
      demo: false
    });

  } catch (error: any) {
    console.error("AI Assistant Error:", error);
    res.status(500).json({
      error: "An error occurred with the AI Assistant service.",
      details: error.message
    });
  }
});

// Vite middleware and static serving
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
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
