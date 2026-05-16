import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("✅ DZIAŁA");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("🔥 SERVER:", PORT);
});
