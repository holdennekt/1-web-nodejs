import http from "http";
import util from "util";
import router, { HttpMethod } from "./router.js";
import { helpers } from "./utils.js";

console.log(util.inspect(router, false, null, true));

const HOST = process.env.HOST || "localhost";
const PORT = Number(process.env.PORT) || 3000;

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
  "x-www-form-urlencoded": (data) =>
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

  const handler = router.getHandler(
    url.pathname,
    req.method || HttpMethod.GET
  );
  handler(req, Object.assign(res, helpers), url, payload);
});

server.listen(PORT, HOST, () => {
  console.log("Server succesfully started on port", PORT);
});
