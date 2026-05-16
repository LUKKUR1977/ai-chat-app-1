import express from "express";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

// ✅ ścieżki
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ app
const app = express();
app.use(express.json());

// ✅ OpenAI
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ strona główna
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ chat endpoint
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

  } catch (error) {
    console.error(error);
    res.json({ reply: "Błąd AI 💥" });
  }
});

// ✅ NAJWAŻNIEJSZE — PORT (NAPRAWIONE)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🔥 PORT:", PORT);
});
