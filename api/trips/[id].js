export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "missing_id" });
  }

  // Since Vercel serverless functions are stateless, we can't use in-memory storage.
  // Return a not-found for now — shared trips require a real database (e.g., Firebase, Supabase).
  return res.status(404).json({ error: "not_found", message: "Shared trips are not available in the hosted version." });
}
