import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "data.json");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// ─── Default Initial State ───────────────────────────────────────
const DEFAULT_STATE = {
  _ts: 0,
  company: {
    name: "Contractor Labour Management",
    code: "SITE-INFRA",
    contractorName: "Javed Contractor",
    contractorMobile: "+91 98765 43210",
    contractorEmail: "admin@contractor.com",
  },
  projects: [
    {
      id: "proj-101",
      name: "Main Construction Site A",
      code: "SITE-A",
      locationName: "Main Site Address, City",
      latitude: 28.6139,
      longitude: 77.209,
      allowedRadiusMeters: 500,
      clientName: "Primary Client",
      status: "active",
    },
  ],
  groups: [
    {
      id: "grp-201",
      name: "General Labour Squad",
      description: "Default site workforce team.",
      leadEmployeeId: null,
    },
  ],
  employees: [],
  attendance: [],
  expenses: [],
  tasks: [],
  dailyReports: [],
  notifications: [],
  payments: [],
};

// ─── File I/O ────────────────────────────────────────────────────
function loadData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_STATE, null, 2));
      return { ...DEFAULT_STATE };
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return { _ts: 0, ...JSON.parse(raw) };
  } catch (err) {
    console.error("Error reading data file:", err);
    return { ...DEFAULT_STATE };
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing data file:", err);
  }
}

// ─── Routes ──────────────────────────────────────────────────────
app.get("/api/sync", (req, res) => res.json(loadData()));

app.post("/api/sync", (req, res) => {
  const newState = req.body;
  if (!newState || typeof newState !== "object") {
    return res.status(400).json({ error: "Invalid state payload" });
  }
  const ts = Date.now();
  saveData({ ...newState, _ts: ts });
  return res.json({ success: true, timestamp: ts });
});

app.post("/api/clear", (req, res) => {
  saveData({ ...DEFAULT_STATE, _ts: Date.now() });
  res.json({ success: true, message: "Database reset to clean state" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ─── Start ───────────────────────────────────────────────────────
const PORT = 5174;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`⚡ Sync Backend running on http://${HOST}:${PORT}`);
  console.log(`   Vite proxy forwards https://.../:5173/api/* → here`);
});
