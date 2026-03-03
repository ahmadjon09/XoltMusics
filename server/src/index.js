import express from "express";
import cors from "cors";
import axios from "axios";
import path from "path";
import os from "os";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import UserRoutes from "./routes/user.route.js";
import TopRoutes from "./routes/top.route.js";
import langMiddleware from "./middlewares/lang.js";
import { t } from "./utils/t.js";
import { searchTracks } from "./services/scraper.js";
import mongoose from "mongoose";
import { startTopMonthlyJob } from "./schedulers/topMonthlyJob.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VERSION = process.env.VERSION || "v1";
const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

const app = express();

// ---------- Helpers ----------
const getLocalIP = () => {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) return net.address;
    }
  }
  return "127.0.0.1";
};

const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ---------- Middlewares ----------
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// ---------- Health ----------
app.get("/v1/status", (_req, res) => {
  res.json({
    status: "working",
    port: PORT,
    version: VERSION,
  });
});

app.get(`/${VERSION}`, (_req, res) =>
  res.send("Server is running!")
);

// ---------- Language middleware ----------
app.use("/:lang", langMiddleware);

// ---------- Routes ----------
app.use(`/:lang/${VERSION}/user`, UserRoutes);
app.use(`/:lang/${VERSION}/top`, TopRoutes);

app.get(`/:lang/${VERSION}/search`, wrap(async (req, res) => {
  let q = String(req.query.q ?? "").trim();
  if (!q) return res.json([]);

  q = q.normalize("NFKC");

  const tracks = await searchTracks(q);
  res.json(tracks);
}));

// ---------- 404 ----------
app.use((req, res) => {
  const lang = req.lang || "en";
  res.status(404).json({ message: t(lang, "ROUTER_404") });
});

// ---------- Error handler ----------
app.use((err, req, res, _next) => {
  console.error("❌ Error:", err);
  const lang = req.lang || "en";
  res.status(500).json({ message: t(lang, "SERVER_ERROR") || "Server error" });
});

// ---------- Keep alive ----------
const keepServerAlive = () => {
  const base = process.env.RENDER_URL;
  if (!base) return;

  const pingInterval = 10 * 60 * 1000;

  const ping = async () => {
    try {
      await axios.get(`${base}/v1/status`, { timeout: 8000 });
      console.log("🔄 Server active");
    } catch {
      console.log("⚠️ Ping failed");
    }
  };

  ping();
  setInterval(ping, pingInterval);
};

// ---------- Start ----------
const startApp = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ MongoDB connected");

    startTopMonthlyJob();

    app.listen(PORT, HOST, () => {
      const ip = getLocalIP();
      console.log("================================");
      console.log("🚀 Server ishga tushdi");
      console.log(`🌐 Localhost: http://localhost:${PORT}/${VERSION}`);
      console.log(`📱 IP orqali: http://${ip}:${PORT}/${VERSION}`);
      console.log("================================");
    });

    keepServerAlive();
  } catch (error) {
    console.error("❌ Startup error:", error);
    process.exit(1);
  }
};

startApp();