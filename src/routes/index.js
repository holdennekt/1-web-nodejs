function GET(req, res, url) {
  const params = Object.fromEntries(url.searchParams);
  res.json({ data: "GET /", params });
}

function OPTIONS(req, res, url, payload) {
  res.json({ data: "OPTIONS /", payload });
}

function POST(req, res, url, payload) {
  res.json({ data: "POST /", payload });
}

export default { handlers: { GET, OPTIONS, POST } };
