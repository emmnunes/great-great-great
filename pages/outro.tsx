import React from "react"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import styled from "styled-components"

import Layout from "./components/Layout"
import Popup from "./components/Popup"

const Outro: NextPage = () => {
  const router = useRouter()
  const [loaded, setLoaded] = React.useState<boolean>(false)
  const [open, setOpen] = React.useState<boolean>(false)

  React.useEffect(() => {
    if(!loaded) {
      setTimeout(() => {
        setLoaded(true)
        setOpen(true)
      }, 500)
    }
  })

  const moveTo = (p: string) => {
    setOpen(false)

    setTimeout(() => {
      router.push(p)
    }, 1000)
  }

  return (
    <Layout id="index">
      <Container>
        <Popup
          keyId="intro"
          size="small"
          color="blue"
          background="milan"
          isVisible={open}
          action={() => { moveTo("/start") }}
          buttonLabel="Start over"
        >
          <p>
            Designed and developed by <a href="https://www.undersight.co" target="_blank">Eduardo Nunes</a>.
          </p>

          <p>
            If you're interested in knowing more about the motivation and inner workings of this project, you can find <a href="https://www.undersight.co/great-great-great/" target="_blank">a small case study on my website</a>.
          </p>

          <p>
            <small>
              Built with with Next.js and ChatGPT 3.5-turbo. Text set in <a href="https://thepytefoundry.net/typefaces/triptych/" target="_blank">Pyte Foundry's Triptych</a>. Photos generated using <a href="https://www.midjourney.com/" target="_blank">Midjourney</a>. Background music adapted from samples by <a href="https://tobyschay.bandcamp.com/" target="_blank">Toby Schay</a>. Be sure to read the <a href="/legal/terms-of-use" target="_blank">Terms of Use</a> and <a href="/legal/privacy-policy" target="_blank">Privacy Policy</a>.
            </small>
          </p>

          <p>
            <small>
              Life is short. Be kind.
            </small>
          </p>
        </Popup>
      </Container>
    </Layout>
  )
}

const Container = styled.section`
  padding: 20px;
`

export default Outro
