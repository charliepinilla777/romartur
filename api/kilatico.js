export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name = "", product = "pulseras", lang = "es" } = req.body || {};
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing Groq API key" });
  }

  const cleanName = String(name).trim();
  const productLabel = String(product || "pulseras").toLowerCase();
  const languageLabel = lang === "en" ? "English" : "Español";
  const displayName = cleanName || (lang === "en" ? "there" : "hola");

  const systemPrompt = `You are Kilatico, a friendly luxury jewelry concierge for Emerald Trade. Respond in ${languageLabel}. Keep responses short (max 3 sentences). Always invite the client to purchase bracelets with an elegant, premium tone. Mention artisan craftsmanship and exclusivity.`;
  const userPrompt = `Client name: ${displayName}. Interested product: ${productLabel}. Reply with a greeting, a helpful sentence, and a call-to-action to buy bracelets.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 180,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).json({ error: errorText });
    }

    const result = await response.json();
    const content = result?.choices?.[0]?.message?.content || "";

    const lines = content.split("\n").filter(Boolean);
    const greeting = lines[0] || (lang === "en" ? "Hi! I'm Kilatico ✨" : "Hola, soy Kilatico ✨");
    const message = lines[1] || (lang === "en" ? "Emerald Trade crafts exclusive artisanal jewelry." : "Emerald Trade crea joyas artesanales exclusivas.");
    const cta = lines[2] || (lang === "en" ? "Would you like to purchase a premium bracelet today?" : "¿Quieres comprar una pulsera premium hoy?");

    return res.status(200).json({ greeting, message, cta });
  } catch (error) {
    return res.status(500).json({ error: "Groq request failed" });
  }
}
