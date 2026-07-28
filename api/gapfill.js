import "dotenv/config";
import { callGroq } from "../server/groqClient.js";
import { GapFillResponseSchema } from "../src/schema/validators.js";

const GAPFILL_SYSTEM_PROMPT = `
You are a trip detour suggester used by a production travel app.
You NEVER chat, apologize, or add commentary.
You ONLY return a single JSON object — no markdown, no code fences, no explanation.

OUTPUT SHAPE:
{
  "detours": [
    {
      "type": "detour",
      "id": "lowercase-kebab-case-unique",
      "name": "Official real-world name",
      "betweenStopIds": ["stop-id-1", "stop-id-2"],
      "extraMinutes": number,
      "reason": "One sentence: why it's worth the quick stop"
    }
  ]
}

HARD RULES:
1. The detour MUST be a real, currently-operating place that exists between (or very near the route between) the two provided stops.
2. It should be a quick, worthwhile stop — a famous viewpoint, a beloved local café, a historic bridge, a scenic park, etc.
3. "extraMinutes" is how many extra minutes this detour adds to the journey (keep it under 30).
4. If there is genuinely nothing worthwhile between the two stops, return: { "detours": [] }. An empty array is perfectly valid and expected.
5. Never invent fictional places.
6. Maximum 1 detour per request.
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { meta, stop1, stop2 } = req.body;

  if (!meta || !stop1 || !stop2) {
    return res.status(400).json({ error: "missing_input", message: "Trip meta, stop1, and stop2 are required." });
  }

  const userPrompt = `
Trip: ${meta.origin} → ${meta.destination}
Vibe: ${meta.vibeTags.join(", ")}

Is there a worthwhile quick stop on the route between:
  Stop A: ${stop1.name} (ID: ${stop1.id})
  Stop B: ${stop2.name} (ID: ${stop2.id})
  `.trim();

  try {
    const raw = await callGroq({
      systemPrompt: GAPFILL_SYSTEM_PROMPT,
      userPrompt,
    });

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.error("GapFill: Groq returned non-JSON:", raw.slice(0, 200));
      return res.status(502).json({ error: "malformed_json", message: "AI returned invalid JSON." });
    }

    const result = GapFillResponseSchema.safeParse(parsed);
    if (!result.success) {
      console.error("GapFill: Zod validation failed:", JSON.stringify(result.error.issues, null, 2));
      return res.status(502).json({ error: "wrong_shape", details: result.error.issues });
    }

    res.json(result.data);
  } catch (err) {
    console.error("GapFill API Error:", err.message);
    const status = err.status === 429 ? 429 : 502;
    res.status(status).json({ error: "upstream_failed", message: err.message });
  }
}
