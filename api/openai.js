import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

export const createCompletion = async (message) => {
  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt:
        `Mensaje: ${message}\n` +
        'Respuesta: ',
      temperature: 0.6,
      max_tokens: 2000
    })
    return completion.data.choices[0].text
  } catch (error) {
    return JSON.stringify(error.response?.data, null, 2)
  }
}

export const createImage = async (prompt) => {
  const response = await openai.createImage({
    prompt,
    n: 1,
    size: '1024x1024'
  })
  return response.data.data[0].url
}
