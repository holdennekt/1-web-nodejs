function GET(req, res, url) {
  const params = Object.fromEntries(url.searchParams);
  res.json({ data: "GET /rand", params });
}

function OPTIONS(req, res, url, payload) {
  res.json({ data: "OPTIONS /rand", payload });
}

function POST(req, res, url, payload) {
  res.json({ data: "POST /rand", payload });
}

export default { handlers: { GET, OPTIONS, POST } };
