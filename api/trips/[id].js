import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "missing_id" });
  }

  try {
    const trip = await kv.get(id);
    
    if (!trip) {
      return res.status(404).json({ error: "not_found", message: "Trip not found." });
    }

    return res.json(trip);
  } catch (err) {
    console.error("KV Get Error:", err);
    return res.status(500).json({ error: "internal_error" });
  }
}

