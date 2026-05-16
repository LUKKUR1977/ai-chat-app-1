import express from "express";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ BEZPIECZNY START
let client;
try {
  client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} catch (e) {
  console.log("OpenAI init error:", e);
}

// ✅ ROOT
app.get("/", (req, res) => {
  res.send("✅ SERVER DZIAŁA");
});

// ✅ CHAT (safe)
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ reply: "Napisz coś 👀" });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: message,
    });

    const reply =
      response?.output?.[0]?.content?.[0]?.text || "Brak odpowiedzi";

    res.json({ reply });

  } catch (e) {
    console.log("CHAT ERROR:", e);
    res.json({ reply: "Błąd AI 💥" });
  }
});

// ✅ CRASH PROTECTION
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT:", err);
});

process.on("unhandledRejection", (err) => {
  console.log("PROMISE ERROR:", err);
});

// ✅ PORT
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("🔥 PORT:", PORT);
});
