import "dotenv/config";
import { callGroq } from "../server/groqClient.js";
import { ItineraryResponseSchema } from "../src/schema/validators.js";

const ITINERARY_SYSTEM_PROMPT = `
You are a trip itinerary organizer used by a production travel app.
You NEVER chat, apologize, or add commentary.
You ONLY return a single JSON object — no markdown, no code fences, no explanation.

OUTPUT SHAPE:
{
  "days": [
    {
      "day": number,
      "title": "A short thematic title for this day (e.g., 'Arrival & Old Town Stroll')",
      "stopIds": ["spot-id-1", "spot-id-2", ...]
    }
  ]
}

HARD RULES:
1. Arrange the provided spots into a logical geographic order within each day so the traveller isn't zig-zagging.
2. The number of day objects MUST match the trip duration provided.
3. DO NOT invent new stop IDs — only use the exact IDs provided by the user.
4. Each provided stop ID must appear in exactly one day.
5. Give each day a short, evocative title — not just "Day 1".
6. Balance the number of stops across days; don't overload one day and leave another empty.
7. Put must-see landmarks in the first half of the trip when energy is highest.
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { meta, selectedSpots } = req.body;

  if (!meta || !selectedSpots || !Array.isArray(selectedSpots) || selectedSpots.length === 0) {
    return res.status(400).json({ error: "missing_input", message: "Trip meta and selected spots are required." });
  }

  const userPrompt = `
Trip: ${meta.origin} → ${meta.destination}
Duration: ${meta.days} days
Vibe: ${meta.vibeTags.join(", ")}

Selected stops (id — name):
${selectedSpots.map(s => `• ${s.id} — ${s.name}`).join("\n")}

Organize these ${selectedSpots.length} stops into ${meta.days} day(s).
  `.trim();

  try {
    const raw = await callGroq({
      systemPrompt: ITINERARY_SYSTEM_PROMPT,
      userPrompt,
    });

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.error("Itinerary: Groq returned non-JSON:", raw.slice(0, 200));
      return res.status(502).json({ error: "malformed_json", message: "AI returned invalid JSON." });
    }

    const result = ItineraryResponseSchema.safeParse(parsed);
    if (!result.success) {
      console.error("Itinerary: Zod validation failed:", JSON.stringify(result.error.issues, null, 2));
      return res.status(502).json({ error: "wrong_shape", details: result.error.issues });
    }

    res.json(result.data);
  } catch (err) {
    console.error("Itinerary API Error:", err.message);
    const status = err.status === 429 ? 429 : 502;
    res.status(status).json({ error: "upstream_failed", message: err.message });
  }
}
