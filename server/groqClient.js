import "dotenv/config";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MAX_RETRIES = 2;

export async function callGroq({ systemPrompt, userPrompt, model = "llama-3.3-70b-versatile" }) {
  // Support either single key or comma-separated list of keys
  const keysEnv = process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY;
  if (!keysEnv) {
    throw Object.assign(
      new Error("GROQ_API_KEY or GROQ_API_KEYS is not set in .env"),
      { status: 500 }
    );
  }

  const keys = keysEnv.split(",").map(k => k.trim()).filter(Boolean);
  let lastErr;

  // We will retry across all keys. 
  // e.g. 2 keys = 2 attempts total if each rate limits.
  // We cap total attempts at MAX_RETRIES or number of keys, whichever is larger, 
  // to ensure we exhaust keys before giving up.
  const totalAttempts = Math.max(MAX_RETRIES + 1, keys.length);

  for (let attempt = 0; attempt < totalAttempts; attempt++) {
    const currentKey = keys[attempt % keys.length];
    
    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
        }),
      });

      if (res.status === 429) {
        // Rate-limited. If we have another key to try, do it immediately.
        console.warn(`Groq rate-limited (429) on key ${attempt % keys.length + 1}/${keys.length}. Switching key...`);
        lastErr = Object.assign(new Error("Rate limited by Groq"), { status: 429 });
        
        // Only sleep if we have exhausted all keys in a round
        if ((attempt + 1) % keys.length === 0 && attempt + 1 < totalAttempts) {
           const retryAfter = parseInt(res.headers.get("retry-after") || "2", 10);
           await new Promise(r => setTimeout(r, Math.min(retryAfter, 5) * 1000));
        }
        continue;
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error(`Groq error ${res.status}:`, text.slice(0, 300));
        throw Object.assign(
          new Error(`Groq request failed: ${res.status}`),
          { status: res.status }
        );
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw Object.assign(new Error("Groq returned empty content"), { status: 502 });
      }

      return content;
    } catch (err) {
      lastErr = err;
      // Only retry on network errors or 429s, not on auth/validation errors
      if (err.status && err.status !== 429 && err.status < 500) {
        throw err;
      }
      if (attempt + 1 < totalAttempts) {
        console.warn(`Groq call failed (attempt ${attempt + 1}/${totalAttempts}): ${err.message}. Retrying...`);
        // Brief pause for network errors
        if (err.status !== 429) await new Promise(r => setTimeout(r, 1000));
      }
    }
  }

  throw lastErr;
}
