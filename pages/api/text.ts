import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

export default async function handler(req, res) {
  if(req.headers.referer && req.headers.referer.includes(process.env.CHAT_URL)) {
    if(req.body.messages.length < 30) {
      try {
        const completion = await openai.createChatCompletion({
          model: `gpt-3.5-turbo-0613`,
          user: req.body.user,
          messages: req.body.messages,
          max_tokens: 1000,
          temperature: 0.8
        })
        res.status(200).json({ result: completion.data })
      } catch (error) {
        if (error.response) {
          res.status(error.response.status).json({
            result: {
              title: `Something went wrong...`,
              description: `There was an issue getting in touch with your ancestors. I’m not yet sure what happened, but will look into it. In the meantime, you can click below to try again. (Error ${error.response.status}: ${error.response.statusText})`,
              link: `/start`
            }
          })
        } else {
          res.status(500).json({
            result: {
              title: `Something went wrong...`,
              description: error.message,
              link: `/start`
            }
          })
        }
      }
    } else {
      res.status(413).json({
        result: {
          title: `Time is fleeting...`,
          description: `I’m incredibly happy that you found this small chatbot interesting enough to keep the conversation going. Unfortunately, this website is but a small experiment, built in my spare time and with my own money. It is not for profit, and it’s powered by a couple of fairly expensive APIs, so I unfortunately can’t afford to let conversations run too long. I hope you understand, and that you enjoyed the experience.`,
          link: `/outro`
        }
      })
    }
  } else {
    res.status(401).json({
      result: {
        title: `Unauthorized`,
        description: `We could not verify the origin of your request. Sorry about that.`,
        link: ``
      }
    })
  }
}
