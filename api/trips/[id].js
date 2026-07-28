import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "missing_id" });
  }

  try {
    const raw = await redis.get(id);

    if (!raw) {
      return res.status(404).json({ error: "not_found", message: "Trip not found." });
    }

    const trip = typeof raw === "string" ? JSON.parse(raw) : raw;
    return res.json(trip);
  } catch (err) {
    console.error("Redis Get Error:", err);
    return res.status(500).json({ error: "internal_error", message: err.message });
  }
}
