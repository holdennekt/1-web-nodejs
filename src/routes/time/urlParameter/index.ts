import http from "http";
import { MyServerResponse } from "../../../router";

function GET(
  req: http.IncomingMessage,
  res: MyServerResponse,
  url: URL,
  payload: any,
  urlParameter: string
) {
  res.json({ data: `GET /time/${urlParameter}`, payload });
}

function OPTIONS(
  req: http.IncomingMessage,
  res: MyServerResponse,
  url: URL,
  payload: any,
  urlParameter: string
) {
  res.json({ data: `OPTIONS /time/${urlParameter}`, payload });
}

function POST(
  req: http.IncomingMessage,
  res: MyServerResponse,
  url: URL,
  payload: any,
  urlParameter: string
) {
  res.json({ data: `POST /time/${urlParameter}`, payload });
}

export { GET, OPTIONS, POST };
