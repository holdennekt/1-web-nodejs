function GET(
  req,
  res,
  url,
  payload,
  urlParameter
) {
  res.json({ data: `GET /time/${urlParameter}`, payload });
}

function OPTIONS(
  req,
  res,
  url,
  payload,
  urlParameter
) {
  res.json({ data: `OPTIONS /time/${urlParameter}`, payload });
}

function POST(
  req,
  res,
  url,
  payload,
  urlParameter
) {
  res.json({ data: `POST /time/${urlParameter}`, payload });
}

export default {
  handlers: { GET, OPTIONS, POST },
  isDynamicURLParameter: true,
};
