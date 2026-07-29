import "dotenv/config";
import { callGroq } from "../server/groqClient.js";
import { TripPlanResponseSchema } from "../src/schema/validators.js";

const DISCOVER_SYSTEM_PROMPT = `
You are a trip-planning data generator used by a production travel app.
You NEVER chat, apologize, or add commentary.
You ONLY return a single JSON object — no markdown, no code fences, no explanation.

OUTPUT SHAPE:
{
  "meta": { "origin": "string", "destination": "string", "days": number, "vibeTags": ["string"], "budget": number, "persons": number },
  "spots": [ {
    "type": "spot",
    "id": "lowercase-kebab-case-unique",
    "name": "Official real-world name",
    "category": "food"|"nature"|"culture"|"nightlife"|"shopping"|"landmark",
    "whyVisit": "One compelling sentence about this place",
    "suggestedDurationMins": number,
    "mustSee": boolean,
    "estimatedCost": number
  } ],
  "restaurants": [ {
    "type": "restaurant",
    "id": "lowercase-kebab-case-unique",
    "name": "Official real-world name",
    "cuisine": "string",
    "priceHint": "$"|"$$"|"$$$",
    "whyRecommended": "One sentence explaining why this restaurant is special",
    "nearStopId": "id-of-nearest-spot" | null,
    "estimatedCost": number
  } ]
}

HARD RULES:
1. EVERY spot and restaurant MUST be a real, currently-operating, well-known place that can be verified on Google Maps. Never invent fictional places.
2. "mustSee" = true ONLY for places that are genuinely world-famous or the top iconic attraction of that city.
3. Restaurants must be real, well-reviewed establishments. Include the actual cuisine type and a realistic price hint (use "₹", "₹₹", or "₹₹₹").
4. "nearStopId" for a restaurant should reference the id of the closest spot in your spots array, or null.
5. Return 15-25 spots and 8-12 restaurants, scaled to trip length. Ensure a large, generous variety of options so the user has plenty to choose from.
6. Provide a rich mix of undeniable 'must-see' tourist icons, as well as trendy, aesthetic hidden gems that are highly popular on web and social media right now.
7. "vibeTags" should be 2-4 lowercase tags that capture the trip's character.
8. "estimatedCost" must be a realistic numerical cost in INR (Indian Rupees). For free spots, use 0. If a user provides a budget, ENSURE the total sum of all estimatedCosts leaves enough room for the trip duration and respects the budget limit. Output the total budget back in "meta".
9. All ids must be unique lowercase-kebab-case.
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { freeform, budget, persons } = req.body;
  const numPersons = persons || 1;

  if (!freeform || typeof freeform !== "string" || freeform.trim().length === 0) {
    return res.status(400).json({ error: "missing_input", message: "A trip description is required." });
  }

  try {
    const userPrompt = budget
      ? `User Request: ${freeform}\nBudget Limit Per Person: ₹${budget} INR\nTotal Persons: ${numPersons}`
      : `User Request: ${freeform}\nTotal Persons: ${numPersons}`;

    const raw = await callGroq({
      systemPrompt: DISCOVER_SYSTEM_PROMPT,
      userPrompt: userPrompt,
    });

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.error("Discover: Groq returned non-JSON:", raw.slice(0, 200));
      return res.status(502).json({ error: "malformed_json", message: "AI returned invalid JSON." });
    }

    const result = TripPlanResponseSchema.safeParse(parsed);
    if (!result.success) {
      console.error("Discover: Zod validation failed:", JSON.stringify(result.error.issues, null, 2));
      return res.status(502).json({ error: "wrong_shape", details: result.error.issues });
    }

    result.data.meta.persons = numPersons;
    if (budget) {
      result.data.meta.budget = Number(budget);
    }

    res.json(result.data);
  } catch (err) {
    console.error("Discover API Error:", err.message);
    const status = err.status === 429 ? 429 : 502;
    res.status(status).json({ error: "upstream_failed", message: err.message });
  }
}
