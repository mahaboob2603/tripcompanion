import "dotenv/config";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MAX_RETRIES = 2;

export async function callGroq({ systemPrompt, userPrompt, model = "llama-3.3-70b-versatile" }) {
  if (!process.env.GROQ_API_KEY) {
    throw Object.assign(
      new Error("GROQ_API_KEY is not set in .env"),
      { status: 500 }
    );
  }

  let lastErr;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
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
        // Rate-limited — wait and retry
        const retryAfter = parseInt(res.headers.get("retry-after") || "2", 10);
        console.warn(`Groq rate-limited (429). Retry ${attempt + 1}/${MAX_RETRIES} after ${retryAfter}s...`);
        await new Promise(r => setTimeout(r, retryAfter * 1000));
        lastErr = Object.assign(new Error("Rate limited by Groq"), { status: 429 });
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
      if (attempt < MAX_RETRIES) {
        console.warn(`Groq call failed (attempt ${attempt + 1}/${MAX_RETRIES + 1}): ${err.message}. Retrying...`);
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }

  throw lastErr;
}
