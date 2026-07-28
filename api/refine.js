import "dotenv/config";
import { callGroq } from "../server/groqClient.js";
import { z } from "zod";

const RefineResponseSchema = z.object({
  title: z.string(),
  stopIds: z.array(z.string())
});

const REFINE_SYSTEM_PROMPT = `
You are a trip itinerary refinement tool.
You NEVER chat, apologize, or add commentary.
You ONLY return a single JSON object — no markdown, no code fences.

OUTPUT SHAPE:
{
  "title": "A short thematic title for this day",
  "stopIds": ["spot-id-1", "spot-id-2", ...]
}

HARD RULES:
1. You are modifying a SINGLE DAY's itinerary based on a user request (e.g. "make it more relaxed").
2. DO NOT invent new stop IDs — only use the exact IDs provided in the available stops list.
3. Keep the output shape exactly as requested.
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { dayPlan, instruction, availableStops } = req.body;

  if (!dayPlan || !instruction || !availableStops) {
    return res.status(400).json({ error: "missing_input" });
  }

  const userPrompt = `
Current Day Plan:
Title: ${dayPlan.title}
Stops: ${dayPlan.stopIds.join(", ")}

Available Stops (ID - Name):
${availableStops.map(s => `• ${s.id} — ${s.name}`).join("\n")}

User Request: "${instruction}"

Apply the user's request to rewrite this single day's plan.
  `.trim();

  try {
    const raw = await callGroq({
      systemPrompt: REFINE_SYSTEM_PROMPT,
      userPrompt,
    });

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return res.status(502).json({ error: "malformed_json" });
    }

    const result = RefineResponseSchema.safeParse(parsed);
    if (!result.success) {
      return res.status(502).json({ error: "wrong_shape", details: result.error.issues });
    }

    res.json(result.data);
  } catch (err) {
    console.error("Refine API Error:", err.message);
    const status = err.status === 429 ? 429 : 502;
    res.status(status).json({ error: "upstream_failed", message: err.message });
  }
}
