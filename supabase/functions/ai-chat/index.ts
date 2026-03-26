// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, mode } = await req.json();
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY is not configured");

    let systemPrompt = "";
    
    if (mode === "chat") {
      systemPrompt = `You are KrishokHub AI Assistant, a helpful agricultural advisor for Bangladeshi farmers. You help with:
- Crop management and best practices
- Market pricing advice
- Weather-related farming tips
- Pest and disease identification
- Soil management
- Harvest timing and post-harvest handling
Always respond in a friendly, practical manner. Use BDT (৳) for prices. Keep answers concise and actionable.`;
    } else if (mode === "pricing") {
      systemPrompt = `You are a smart pricing advisor for agricultural products in Bangladesh. Analyze market trends and provide pricing suggestions. Consider:
- Seasonal demand patterns
- Regional price variations
- Freshness and quality grades
- Wholesale vs retail pricing
Respond with JSON format: { "suggestions": [{ "crop": string, "suggestedPrice": number, "reasoning": string, "action": "sell_now" | "hold" | "bulk_sell" }] }`;
    } else if (mode === "demand") {
      systemPrompt = `You are a demand prediction AI for agricultural markets in Bangladesh. Based on the provided context, predict which crops will be in high demand. Consider seasonal patterns, regional preferences, and market trends. Respond with JSON: { "predictions": [{ "crop": string, "region": string, "demandLevel": "high" | "medium" | "low", "reasoning": string, "expectedPriceRange": string }] }`;
    } else if (mode === "disease") {
      systemPrompt = `You are a crop disease detection assistant. Based on the description of symptoms, identify potential plant diseases and suggest treatments. Provide practical advice that Bangladeshi farmers can implement. Include both organic and chemical treatment options.`;
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI API quota exceeded. Please check your API key billing." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
