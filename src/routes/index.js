function GET(
  req,
  res,
  url,
  payload
) {
  res.json({ data: "GET /", payload });
}

function OPTIONS(
  req,
  res,
  url,
  payload
) {
  res.json({ data: "OPTIONS /", payload });
}

function POST(
  req,
  res,
  url,
  payload
) {
  res.json({ data: "POST /", payload });
}

export default { handlers: { GET, OPTIONS, POST } };
