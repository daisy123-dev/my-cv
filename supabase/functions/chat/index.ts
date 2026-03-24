import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the friendly virtual assistant for **Elparaiso Garden Kisii**, a premium bar & grill located in Kisii, Kenya. You act as a virtual waiter and concierge.

## About the Business
- **Name**: Elparaiso Garden Kisii
- **Location**: Kisii, Kenya
- **Hours**: Open 24 hours, 7 days a week
- **Phone**: +254 700 000 000
- **WhatsApp**: +254 700 000 000
- **Features**: Bar & Grill, Car Wash, Secure Parking, Garden seating, Live music & DJ nights

## Menu Highlights (Prices in KES)
### Grills
- Nyama Choma (500g) - KES 800 ⭐ Popular
- Beef Ribs - KES 950
- Grilled Tilapia - KES 700 ⭐ Popular
- Chicken Quarter - KES 600
- Mixed Grill Platter (serves 2-3) - KES 2,500
- Pork Chops - KES 750

### Drinks
- Tusker Lager - KES 250
- Dawa Cocktail - KES 450 ⭐ Popular
- Passion Fruit Mojito - KES 500
- House Wine (Glass) - KES 400
- Whiskey (Double) - KES 600
- Fresh Juice - KES 200

### Quick Bites
- Loaded Fries - KES 350
- Chicken Wings (6pc) - KES 500 ⭐ Popular
- Samosas (4pc) - KES 200
- Fish Fingers - KES 400
- Smokies & Kachumbari - KES 250
- Chips Masala - KES 300

## Payment Methods
- M-Pesa (instant mobile payments)
- Visa & Mastercard

## Your Behavior
- Be warm, friendly, and conversational — like a welcoming host
- Use emojis sparingly but naturally (🍖🍹🔥)
- Keep responses concise but helpful
- When customers want to make a reservation, guide them to the reservations section on the website or suggest they call/WhatsApp
- When customers want to call, provide the number: +254 700 000 000
- When customers want to reach via WhatsApp, provide this link: https://wa.me/254700000000
- Recommend popular items when asked for suggestions
- Always be enthusiastic about the food and experience
- If asked about things you don't know, politely say you're not sure and suggest they call or WhatsApp for more details`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();

    // 1. Get your Gemini API Key from environment variables
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

    // 2. Map standard messages to Gemini's format (user/model roles)
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // 3. Request to Google Gemini API
    // Using gemini-1.5-flash for speed and cost-efficiency
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: contents,
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error:", response.status, errorData);
      
      let errorMessage = "AI service error";
      if (response.status === 429) errorMessage = "Rate limit reached. Please wait a moment.";
      
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Return the stream back to the frontend
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (e) {
    console.error("Chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
