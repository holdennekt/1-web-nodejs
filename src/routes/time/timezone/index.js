function GET(req, res, url) {
  const params = Object.fromEntries(url.searchParams);
  res.json({ data: `GET /time/${req.params.timezone}`, params });
}

function OPTIONS(req, res, url, payload) {
  res.json({ data: `OPTIONS /time/${req.params.timezone}`, payload });
}

function POST(req, res, url, payload) {
  res.json({ data: `POST /time/${req.params.timezone}`, payload });
}

export default {
  handlers: { GET, OPTIONS, POST },
  isDynamicURLParameter: true,
};
