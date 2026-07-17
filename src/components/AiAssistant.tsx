import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, X, MessageSquare, Volume2, ShoppingCart, CheckCircle, Brain, Apple } from 'lucide-react';
import { ChatMessage, Product, CartItem } from '../types';
import { PRODUCTS } from '../data/products';

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
}

export default function AiAssistant({
  isOpen,
  onClose,
  cart,
  onAddToCart
}: AiAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'init',
        sender: 'ai',
        text: "Hi! I am your AI Shopping Assistant at Daily Needs. 🌟\n\nTell me what you're craving or planning to cook! I can suggest healthy recipes, find the best brands, and help you add items directly to your basket. Try asking:\n- 'Suggest a quick pasta recipe'\n- 'Give me healthy fruit breakfast ideas'\n- 'Are there any good deals on snacks?'",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  // Search keyword parser to extract recommendations
  const extractRecommendations = (text: string): string[] => {
    const textLower = text.toLowerCase();
    const matchedIds: string[] = [];

    // Let's search inside our PRODUCTS database to find keyword matches
    PRODUCTS.forEach((p) => {
      const nameParts = p.name.toLowerCase().split(' ');
      const brandLower = p.brand.toLowerCase();
      const catLower = p.category.toLowerCase();

      // If the text contains specific name segments, brand, or category
      if (
        textLower.includes(p.name.toLowerCase()) ||
        (nameParts.length > 1 && textLower.includes(nameParts[0]) && textLower.includes(nameParts[1])) ||
        (textLower.includes(brandLower) && textLower.includes(catLower))
      ) {
        if (!matchedIds.includes(p.id)) {
          matchedIds.push(p.id);
        }
      }
    });

    // Fallback default popular recommendations if nothing matched but food is mentioned
    if (matchedIds.length === 0) {
      if (textLower.includes('pasta') || textLower.includes('spaghetti')) {
        const pasta = PRODUCTS.find(p => p.name.includes('Penne') || p.name.includes('Pasta'));
        const sauce = PRODUCTS.find(p => p.brand === 'Veeba' || p.brand === 'Kissan');
        if (pasta) matchedIds.push(pasta.id);
        if (sauce) matchedIds.push(sauce.id);
      } else if (textLower.includes('breakfast') || textLower.includes('morning')) {
        const milk = PRODUCTS.find(p => p.name.includes('Milk'));
        const bread = PRODUCTS.find(p => p.name.includes('Bread'));
        const almond = PRODUCTS.find(p => p.name.includes('Almond'));
        if (milk) matchedIds.push(milk.id);
        if (bread) matchedIds.push(bread.id);
        if (almond) matchedIds.push(almond.id);
      } else if (textLower.includes('fruit') || textLower.includes('fresh')) {
        const apple = PRODUCTS.find(p => p.name.includes('Apple'));
        const banana = PRODUCTS.find(p => p.name.includes('Banana'));
        if (apple) matchedIds.push(apple.id);
        if (banana) matchedIds.push(banana.id);
      } else if (textLower.includes('snack') || textLower.includes('deal') || textLower.includes('sale')) {
        const chips = PRODUCTS.find(p => p.name.includes('Chips') || p.name.includes('Lay\'s'));
        const chocolate = PRODUCTS.find(p => p.name.includes('Chocolate') || p.name.includes('Dairy Milk'));
        if (chips) matchedIds.push(chips.id);
        if (chocolate) matchedIds.push(chocolate.id);
      }
    }

    return matchedIds.slice(0, 3); // limit to 3 recommendation cards
  };

  const handleSendMessage = async (forcedQuery?: string) => {
    const query = (forcedQuery || inputMessage).trim();
    if (!query) return;

    setInputMessage('');
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Send chat payload to server proxy
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.slice(-5), // Send last 5 messages for context
          currentCart: cart.map(item => ({ name: item.product.name, qty: item.quantity, price: item.product.sellingPrice })),
          userQuery: query
        })
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const data = await response.json();
      
      // Auto recommend items based on Gemini response keywords
      const recs = extractRecommendations(data.text);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProducts: recs.length > 0 ? recs : undefined
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error('Error fetching AI chat:', error);
      // Fallback
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "I experienced a brief connection glitch, but I highly recommend trying out our Premium Royal Gala Apples and Amul Salted Butter! Let me know if you would like me to assist with anything else.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProducts: [PRODUCTS[0].id, PRODUCTS[10].id] // Default Gala Apple and Butter
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice dictation is unsupported on this browser.');
      return;
    }
    setIsListening(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const speech = event.results[0][0].transcript;
      setInputMessage(speech);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleAddToCartFromChat = (prod: Product) => {
    onAddToCart(prod);
    setAddedProductId(prod.id);
    setTimeout(() => setAddedProductId(null), 2500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm" id="ai-chat-bubble">
      {/* Container Card */}
      <div className="bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 flex flex-col h-[520px] overflow-hidden animate-slide-up">
        
        {/* Header Title bar */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between select-none">
          <div className="flex items-center gap-2 text-left">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md">
              <Sparkles className="w-4 h-4 text-white fill-current animate-pulse" />
            </div>
            <div>
              <h3 className="font-display font-black text-sm tracking-tight flex items-center gap-1">AI Shopping Genie</h3>
              <p className="text-[9px] text-brand-green font-extrabold uppercase tracking-widest flex items-center gap-1">
                <Brain className="w-3 h-3 text-brand-green fill-brand-green/10" /> Powered by Gemini Flash
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full text-gray-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Logs */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div key={m.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs text-left leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none font-semibold shadow-xs'
                    : 'bg-slate-800/80 text-gray-200 rounded-tl-none font-medium border border-slate-800'
                }`}>
                  {/* Formatted rendering with lines */}
                  {m.text.split('\n').map((line, lidx) => (
                    <p key={lidx} className={line.trim() ? 'mb-1 last:mb-0' : 'h-2'}>{line}</p>
                  ))}
                </div>
                <span className="text-[8px] text-gray-500 font-bold tracking-wider mt-1 px-1">{m.timestamp}</span>

                {/* Suggested recommendation items attached under AI reply */}
                {!isUser && m.suggestedProducts && (
                  <div className="w-full mt-2 space-y-2 text-left bg-slate-950/40 p-2.5 rounded-2xl border border-slate-800">
                    <p className="text-[9px] font-black tracking-wider uppercase text-indigo-400 flex items-center gap-1">
                      <Apple className="w-3 h-3 text-indigo-400" /> Recommended Catalog Matches:
                    </p>
                    {m.suggestedProducts.map((pId) => {
                      const prod = PRODUCTS.find((x) => x.id === pId);
                      if (!prod) return null;
                      return (
                        <div key={prod.id} className="flex items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-2 rounded-xl text-3xs">
                          <div className="flex items-center gap-2">
                            <img src={prod.images[0]} alt={prod.name} className="w-8 h-8 object-cover rounded-md border border-slate-800" referrerPolicy="no-referrer" />
                            <div>
                              <p className="font-bold text-gray-400 uppercase tracking-wide leading-none">{prod.brand}</p>
                              <p className="font-bold text-gray-100 line-clamp-1 leading-snug">{prod.name}</p>
                              <p className="text-brand-green font-bold">₹{prod.sellingPrice} ({prod.weight} {prod.unit})</p>
                            </div>
                          </div>
                          
                          {/* Chat Add button */}
                          <button
                            onClick={() => handleAddToCartFromChat(prod)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded-lg flex items-center gap-1 shadow-xs font-bold uppercase transition-colors cursor-pointer"
                          >
                            {addedProductId === prod.id ? (
                              <CheckCircle className="w-3.5 h-3.5 text-brand-yellow animate-bounce" />
                            ) : (
                              <>
                                <ShoppingCart className="w-3.5 h-3.5" /> ADD
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading bubble */}
          {isLoading && (
            <div className="flex items-start">
              <div className="bg-slate-800 text-gray-300 rounded-2xl rounded-tl-none p-3 text-xs text-left animate-pulse border border-slate-850">
                AI is typing suggestions... 💫
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Conversation Input bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2">
          {/* Quick-reply Tags */}
          <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
            <button
              onClick={() => handleSendMessage("Suggest a quick pasta recipe")}
              className="px-2.5 py-1 bg-slate-800 hover:bg-indigo-600 rounded-full text-[10px] font-bold text-gray-300 transition-colors whitespace-nowrap cursor-pointer"
            >
              🍝 Pasta Recipe
            </button>
            <button
              onClick={() => handleSendMessage("Give me healthy fruit breakfast ideas")}
              className="px-2.5 py-1 bg-slate-800 hover:bg-indigo-600 rounded-full text-[10px] font-bold text-gray-300 transition-colors whitespace-nowrap cursor-pointer"
            >
              🍎 Healthy Breakfast
            </button>
            <button
              onClick={() => handleSendMessage("Are there any good deals on snacks?")}
              className="px-2.5 py-1 bg-slate-800 hover:bg-indigo-600 rounded-full text-[10px] font-bold text-gray-300 transition-colors whitespace-nowrap cursor-pointer"
            >
              🍟 Deals & Snacks
            </button>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1.5 focus-within:border-indigo-500"
          >
            <input
              type="text"
              placeholder="Ask Genie (e.g., 'Plan a healthy breakfast')"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="w-full bg-transparent px-3 py-1.5 text-xs text-white focus:outline-hidden font-medium placeholder-gray-500"
            />
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`p-1.5 rounded-lg hover:bg-slate-800 transition-all ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-gray-400'}`}
                title="Voice dictation"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg shadow-md transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
