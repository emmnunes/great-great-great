import { Readable } from "stream"

export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB",
      {
        method: "POST",
        body: JSON.stringify({
          text: req.body.prompt,
          voice_settings: {
            stability: 1,
            similarity_boost: 1
          }
        }),
        headers: {
          "content-type": "application/json",
          "xi-api-key": process.env.ELEVEN_LABS_API_KEY,
          Accept: "audio/mpeg"
        }
      }
    )

    if (response.ok) {
      const blob = await response.blob()
      const buffer = await blob.arrayBuffer()
      const stream = Readable.from(Buffer.from(new Uint8Array(buffer)))
      res.setHeader("Content-Type", "audio/mpeg")
      stream.pipe(res)
    } else {
      console.log("Error retrieving audio file.")
      res.status(response.status).end()
    }
  } catch (error) {
    console.log(error)
    res.status(500).end()
  }
}
