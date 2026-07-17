import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini API client on the server securely
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      console.log('Gemini API client initialized successfully.');
    } catch (err) {
      console.error('Error initializing Gemini API Client:', err);
    }
  } else {
    console.warn('GEMINI_API_KEY is not defined in environment variables. AI features will run in demo/fallback mode.');
  }

  // API route for AI Shopping Assistant
  app.post('/api/ai/chat', async (req, res) => {
    const { messages, currentCart, userQuery } = req.body;

    // Fallback/Demo mode if API key is not configured
    if (!ai) {
      const responses = [
        "I'd love to help you find some groceries! Try adding fresh Alphonso Mangoes or Premium Royal Gala Apples. They are currently on sale!",
        "Making pasta tonight? I recommend Del Monte Penne Pasta paired with Veeba Eggless Mayonnaise or Kissan Tomato Ketchup for a quick side salad!",
        "That sounds delicious! For this recipe, you will need Whole Wheat Atta, Tata Salt, and MDH Garam Masala. I can help you search for these in our categories.",
        "To stay healthy, try adding Epigamia Blueberry Greek Yogurt and Happilo Premium Almonds to your cart. They make a great breakfast duo!",
        "Sure, I can help you search for dairy items. We have Mother Dairy Full Cream Milk, Amul Butter, Amul Paneer, and Cheese Slices ready for 10-minute delivery."
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];
      return res.json({
        text: `[Demo Assistant Mode] ${randomReply}\n\n(Note: To enable full AI intelligence, please add a valid GEMINI_API_KEY in the Secrets panel in Settings).`
      });
    }

    try {
      // Create a prompt with instructions and context about our grocery store "Daily Needs"
      const systemInstruction = `You are a helpful, professional, and friendly AI Grocery Shopping Assistant at "Daily Needs", an ultra-fast grocery delivery website (comparable to Blinkit, Zepto, and BigBasket).
      
Your goal is to assist customers with:
1. Finding grocery items in our categories (Fruits, Vegetables, Dairy, Bread, Bakery, Rice, Atta, Pulses, Tea, Coffee, Snacks, Chocolates, Beverages, Cleaning, Pet Care, etc.).
2. Suggesting recipes (like Pasta, Butter Paneer, Salads, Pancakes, Chai, Sandwiches, Maggie) and recommending matching products from common brands (like Amul, Britannia, Tata Sampann, Nescafe, McCain, Real Fruit, Dettol, Surf Excel).
3. Helping customers plan healthy meals, breakfast, snacks, or party menus.

Rules:
- Give short, concise, scannable, and engaging replies with bullet points for easy reading.
- Do not make up products we don't carry; refer to popular Indian brands (Amul, Mother Dairy, Tata, Everest, Fortune, Britannia, Haldiram's, Lay's, Maggi, Paper Boat, Gillette, Pampers, Surf Excel).
- When suggesting items, mention their weight/price conceptually (e.g., "Amul Paneer 200g at ₹85" or "Fuji Apples 1kg at ₹199").
- Use a friendly, polite tone.
- Current cart items in user's session: ${JSON.stringify(currentCart || [])}.
- Direct the user with action items.`;

      // Transform messages into a format suitable for generating content
      const contents = messages.map((m: { sender: string; text: string }) => {
        return {
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        };
      });

      // Add the final user query to the contents
      contents.push({
        role: 'user',
        parts: [{ text: userQuery }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const replyText = response.text || "I'm sorry, I could not process that request. Let me know if there's anything else I can search for!";
      res.json({ text: replyText });

    } catch (error: any) {
      console.error('Error calling Gemini API:', error);
      res.status(500).json({ error: 'Failed to communicate with the AI assistant. Please try again.', details: error.message });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite development middleware mounted.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Production static file serving enabled.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express server running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start full-stack server:', err);
});
