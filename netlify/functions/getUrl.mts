// export const handler = async (event, context) => {
//   console.log({ event }, { context })
//   const POKE_API = 'https://pokeapi.co/api/v2/pokedex/kanto'

//   const response = await fetch(POKE_API)
//   const data = await response.json()

//   return {
//     statusCode: 200,
//     body: JSON.stringify({
//       data,
//     }),
//   }
// }

export default async (request, context) => {
  console.log({ request }, { context })
  const body = await request.json()
  console.log('BODY', body)
  try {
    const response = await fetch(body.url, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.mx.api.v1+json',
        'Accept-Language': 'en',
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${body.clientExtGuid}:${body.apiKey}`)}`,
      },
      body: JSON.stringify(body.widget_url),
    })
    const data = await response.json()
    console.log('DATA', data)
    return Response.json({ data })
  } catch (error) {
    console.log('ERROR', error)
    return Response.json({ error: 'Failed fetching data' }, { status: 500 })
  }
}
