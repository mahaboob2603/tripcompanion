import express from "express";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "trips.json");

// Helper to ensure db file exists
async function getDb() {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.writeFile(DB_PATH, JSON.stringify({}), "utf-8");
      return {};
    }
    throw err;
  }
}

async function saveDb(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

router.post("/trips", async (req, res) => {
  try {
    const { itinerary, selectedSpots, meta } = req.body;
    
    if (!itinerary || !selectedSpots || !meta) {
      return res.status(400).json({ error: "missing_data" });
    }

    const db = await getDb();
    
    // Generate a 6-character random ID
    const id = crypto.randomBytes(3).toString("hex");
    
    db[id] = { itinerary, selectedSpots, meta, createdAt: new Date().toISOString() };
    await saveDb(db);
    
    res.json({ id });
  } catch (err) {
    console.error("Save Trip Error:", err);
    res.status(500).json({ error: "internal_error" });
  }
});

router.get("/trips/:id", async (req, res) => {
  try {
    const db = await getDb();
    const trip = db[req.params.id];
    
    if (!trip) {
      return res.status(404).json({ error: "not_found" });
    }
    
    res.json(trip);
  } catch (err) {
    console.error("Load Trip Error:", err);
    res.status(500).json({ error: "internal_error" });
  }
});

export default router;
