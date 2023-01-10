import http from "http";
import { MyServerResponse } from "../../router";

function GET(
  req: http.IncomingMessage,
  res: MyServerResponse,
  url: URL,
  payload: any
) {
  res.json({ data: "GET /rand", payload });
}

function OPTIONS(
  req: http.IncomingMessage,
  res: MyServerResponse,
  url: URL,
  payload: any
) {
  res.json({ data: "OPTIONS /rand", payload });
}

function POST(
  req: http.IncomingMessage,
  res: MyServerResponse,
  url: URL,
  payload: any
) {
  res.json({ data: "POST /rand", payload });
}

export default { handlers: { GET, OPTIONS, POST } };
