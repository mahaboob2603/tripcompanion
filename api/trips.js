import crypto from "crypto";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { itinerary, selectedSpots, meta } = req.body;

    if (!itinerary || !selectedSpots || !meta) {
      return res.status(400).json({ error: "missing_data" });
    }

    const id = crypto.randomBytes(3).toString("hex");
    const tripData = { itinerary, selectedSpots, meta, createdAt: new Date().toISOString() };

    try {
      await redis.set(id, JSON.stringify(tripData));
      return res.json({ id });
    } catch (err) {
      console.error("Redis Set Error:", err);
      return res.status(500).json({ error: "internal_error", message: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
