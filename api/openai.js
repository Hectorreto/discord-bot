import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

export const createCompletion = async (message) => {
  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: message,
      temperature: 0.6,
      max_tokens: 2000
    })
    return completion.data.choices[0].text
  } catch (error) {
    return 'Chatgpt quiere que pague :c'
  }
}
