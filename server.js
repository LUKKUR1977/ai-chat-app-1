import express from "express";

const app = express();

// ✅ najprostszy test
app.get("/", (req, res) => {
  res.send("✅ DZIAŁA SERVER");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("🔥 SERVER START:", PORT);
});
