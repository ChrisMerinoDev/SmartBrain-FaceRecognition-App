import { Router } from "express";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 30 * 1024 * 1024 }, // 30 MB
  });

const CLARIFAI_PAT = process.env.CLARIFAI_PAT;
const MODEL_ID = "face-detection";
const CLARIFAI_URL = `https://api.clarifai.com/v2/models/${MODEL_ID}/outputs`;

function stripDataUrlPrefix(b64) {
  if (!b64) return b64;
  const comma = b64.indexOf(",");
  return b64.startsWith("data:") && comma !== -1 ? b64.slice(comma + 1) : b64;
}

async function callClarifai({ imageUrl, imageBase64 }) {
  const body = {
    user_app_id: { user_id: "clarifai", app_id: "main" },
    inputs: [{ data: { image: imageUrl ? { url: imageUrl } : { base64: stripDataUrlPrefix(imageBase64) } } }],
  };
  const r = await fetch(CLARIFAI_URL, {
    method: "POST",
    headers: { Authorization: `Key ${CLARIFAI_PAT}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const text = await r.text();
    const err = new Error(`Clarifai ${r.status}: ${text}`);
    err.status = r.status;
    throw err;
  }
  return r.json();
}

router.post("/face-detect", async (req, res) => {
  try {
    const { imageUrl, imageBase64 } = req.body || {};
    if (!CLARIFAI_PAT) return res.status(500).json({ error: "Server misconfigured: CLARIFAI_PAT missing" });
    if (!imageUrl && !imageBase64) return res.status(400).json({ error: "Provide either imageUrl or imageBase64" });
    const data = await callClarifai({ imageUrl, imageBase64 });
    res.json(data);
  } catch (err) {
    console.error("Clarifai error:", err);
    res.status(err.status || 500).json({ error: "Clarifai request failed", detail: err.message });
  }
});

router.post("/face-detect/upload", upload.single("image"), async (req, res) => {
  try {
    if (!CLARIFAI_PAT) return res.status(500).json({ error: "Server misconfigured: CLARIFAI_PAT missing" });
    if (!req.file?.buffer) return res.status(400).json({ error: "No file uploaded (field name should be 'image')" });
    const imageBase64 = req.file.buffer.toString("base64");
    const data = await callClarifai({ imageBase64 });
    res.json(data);
  } catch (err) {
    console.error("Clarifai upload error:", err);
    res.status(err.status || 500).json({ error: "Clarifai request failed", detail: err.message });
  }
});

export default router;
