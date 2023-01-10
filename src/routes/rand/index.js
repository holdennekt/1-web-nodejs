function GET(
  req,
  res,
  url,
  payload
) {
  res.json({ data: "GET /rand", payload });
}

function OPTIONS(
  req,
  res,
  url,
  payload
) {
  res.json({ data: "OPTIONS /rand", payload });
}

function POST(
  req,
  res,
  url,
  payload
) {
  res.json({ data: "POST /rand", payload });
}

export default { handlers: { GET, OPTIONS, POST } };
