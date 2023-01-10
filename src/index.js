import http from "http";
import router from "./router.js";
import { helpers } from "./utils.js";

const HOST = process.env.HOST || "localhost";
const PORT = parseInt(process.env.PORT) || 3000;

const contentTypeParsers = {
  "text/html": (data) => data,
  "text/plain": (data) => data,
  "application/json": (data) => {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  },
  "application/x-www-form-urlencoded": (data) =>
    Object.fromEntries(new URLSearchParams(data)),
};

const server = new http.Server(async (req, res) => {
  const url = new URL(req.url || "/", `https://${req.headers.host}`);

  let rawRequest = "";
  for await (const chunk of req) {
    rawRequest += chunk;
  }

  let payload = {};

  const contentType = req.headers["content-type"]?.split(";")[0];
  if (contentType) {
    const payloadParser = contentTypeParsers[contentType];
    if (payloadParser) payload = payloadParser(rawRequest);
  }

  const { handler, params } = router.getHandlerAndParams(
    url.pathname,
    req.method || "GET"
  );
  req.params = params;
  handler(req, Object.assign(res, helpers), url, payload);
});

server.listen(PORT, HOST, () => {
  console.log("Server succesfully started on port", PORT);
});
