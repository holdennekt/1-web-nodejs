import http from "http";
import { MyServerResponse } from "../router";

function GET(
  req: http.IncomingMessage,
  res: MyServerResponse,
  url: URL,
  payload: any
) {
  res.json({ data: "GET /", payload });
}

function OPTIONS(
  req: http.IncomingMessage,
  res: MyServerResponse,
  url: URL,
  payload: any
) {
  res.json({ data: "OPTIONS /", payload });
}

function POST(
  req: http.IncomingMessage,
  res: MyServerResponse,
  url: URL,
  payload: any
) {
  res.json({ data: "POST /", payload });
}

export default { handlers: { GET, OPTIONS, POST } };
