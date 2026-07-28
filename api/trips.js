import crypto from "crypto";
import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { itinerary, selectedSpots, meta } = req.body;

    if (!itinerary || !selectedSpots || !meta) {
      return res.status(400).json({ error: "missing_data" });
    }

    const id = crypto.randomBytes(3).toString("hex");
    const tripData = { itinerary, selectedSpots, meta, createdAt: new Date().toISOString() };
    
    try {
      await kv.set(id, tripData);
      return res.json({ id });
    } catch (err) {
      console.error("KV Set Error:", err);
      return res.status(500).json({ error: "internal_error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

