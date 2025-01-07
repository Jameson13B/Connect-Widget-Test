import axios from 'axios'

export default async (request, context) => {
  const req = await request.json()

  try {
    return axios
      .request({
        method: 'POST',
        url: req.url,
        headers: {
          Accept: 'application/vnd.mx.api.v1+json',
          'Accept-Language': 'en',
          'Content-Type': 'application/json',
          Authorization: req.token,
        },
        data: JSON.stringify({ widget_url: req.body }),
      })
      .then((response: any) => {
        return Response.json({ data: response.data })
      })
  } catch (error) {
    console.log('ERROR: ', error)
    return Response.json({ error: 'Failed fetching data' }, { status: 500 })
  }
}
