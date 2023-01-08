import http from "http";

const HOST = process.env.HOST || "localhost";
const PORT = Number(process.env.PORT) || 3000;

const server = new http.Server((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello world!");
});

server.listen(PORT, HOST, () => {
  console.log("Server succesfully started on port", PORT);
});
