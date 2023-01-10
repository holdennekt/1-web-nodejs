function GET(
  req,
  res,
  url,
  payload
) {
  res.json({ data: "GET /time", payload });
}

function OPTIONS(
  req,
  res,
  url,
  payload
) {
  res.json({ data: "OPTIONS /time", payload });
}

function POST(
  req,
  res,
  url,
  payload
) {
  res.json({ data: "POST /time", payload });
}

export default { handlers: { GET, OPTIONS, POST } };
