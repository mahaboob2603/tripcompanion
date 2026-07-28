import crypto from "crypto";

// In-memory store (Vercel serverless functions are ephemeral, 
// so this only persists within a single invocation's lifetime.
// For production, use a real database.)
const memoryStore = {};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { itinerary, selectedSpots, meta } = req.body;

    if (!itinerary || !selectedSpots || !meta) {
      return res.status(400).json({ error: "missing_data" });
    }

    const id = crypto.randomBytes(3).toString("hex");
    memoryStore[id] = { itinerary, selectedSpots, meta, createdAt: new Date().toISOString() };

    return res.json({ id });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
