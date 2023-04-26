import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

export default async function handler(req, res) {
  const moderation = await openai.createModeration({
    input: req.body.input
  })
  res.status(200).json({ result: moderation.data })
}
