const http = require("http");

const server = http.createServer((req, res) => {
  res.end("✅ DZIAŁA NA PEWNO");
});

server.listen(process.env.PORT || 8080, () => {
  console.log("server działa");
});
