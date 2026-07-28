import express from "express";
import "dotenv/config";
import discoverRouter from "./routes/discover.js";
import itineraryRouter from "./routes/itinerary.js";
import gapfillRouter from "./routes/gapfill.js";
import refineRouter from "./routes/refine.js";
import tripsRouter from "./routes/trips.js";

const app = express();
const port = process.env.PORT || 8787;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api", discoverRouter);
app.use("/api", itineraryRouter);
app.use("/api", gapfillRouter);
app.use("/api", refineRouter);
app.use("/api", tripsRouter);

app.listen(port, "127.0.0.1", () => {
  console.log(`Backend proxy running on http://127.0.0.1:${port}`);
});
