export const handler = async (event) => {
  const params = event.queryStringParameters || {};
  const path = params.path;

  if (!path || !/^lego\/[\w\-\/]+\/?$/.test(path)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid path' }),
    };
  }

  const upstreamParams = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (k !== 'path') upstreamParams.set(k, v);
  }
  upstreamParams.set('key', process.env.REBRICKABLE_API_KEY);

  const apiUrl = `https://rebrickable.com/api/v3/${path}?${upstreamParams}`;

  try {
    const response = await fetch(apiUrl, {
      headers: { Accept: 'application/json' },
    });
    const body = await response.text();
    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json' },
      body,
    };
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: 'Failed to reach Rebrickable API' }),
    };
  }
};