export default async (request, context) => {
  const req = await request.json()

  try {
    const response = await fetch(req.url, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.mx.api.v1+json',
        'Accept-Language': 'en',
        'Content-Type': 'application/json',
        Authorization: req.token,
      },
      body: JSON.stringify({ widget_url: req.body }),
    })
    const data = await response.json()

    return Response.json({ data })
  } catch (error) {
    console.log('ERROR: ', error)
    return Response.json(
      { error: 'Failed fetching data', details: error },
      { status: 500 }
    )
  }
}
