import express from "express";

const app = express();

// ✅ ping route
app.get("/", (req, res) => {
  res.send("✅ SERVER DZIAŁA NA 100%");
});

// ✅ klucz — keep alive
setInterval(() => {
  console.log("keep alive...");
}, 5000);

// ✅ bardzo ważne zabezpieczenia
process.on("uncaughtException", (err) => {
  console.log("ERROR:", err);
});

process.on("unhandledRejection", (err) => {
  console.log("PROMISE ERROR:", err);
});

// ✅ PORT
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("🔥 START NA PORCIE:", PORT);
});

