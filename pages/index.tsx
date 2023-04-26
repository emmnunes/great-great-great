import React from "react"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import styled from "styled-components"

import Layout from "./components/Layout"
import Popup from "./components/Popup"

const Home: NextPage = () => {
  const router = useRouter()
  const [loaded, setLoaded] = React.useState<boolean>(false)
  const [step, setStep] = React.useState<number>(0)

  React.useEffect(() => {
    if(!loaded) {
      setTimeout(() => {
        setStep(1)
        setLoaded(true)
      }, 3800)
    }
  })

  const moveSteps = (s: number) => {
    if(step === 0) {
      setStep(s)
    } else {
      setStep(0)

      setTimeout(() => {
        setStep(s)
      }, 200)
    }
  }

  const moveToPath = (p: string) => {
    setStep(3)

    setTimeout(() => {
      router.push(p)
    }, 1000)
  }

  return (
    <Layout id="index">
      <Container>
        <Popup
          keyId="intro"
          color="blue"
          background="milan"
          isVisible={step === 1}
          action={() => { moveSteps(2) }}
          buttonLabel="Let’s try it"
        >
          <p>
            Have you ever wished you could have a conversation with someone from the past? Me too. So I've created a chatbot that lets you talk to your ancestors. Sort of.
          </p>
        </Popup>

        <Popup
          keyId="disclaimer"
          size="small"
          color="blue"
          background="bisque"
          isVisible={step === 2}
          action={() => { moveToPath("/start") }}
          buttonLabel="I understand"
        >
          <p>
            A serious disclaimer first: this website is a work of <strong>fiction</strong>. It uses AI to generate text that is coherent and somewhat believable but has no basis in reality or historical facts. <em>However</em>, even fictional stories can sometimes elicit strong emotions in human beings. Please be mindful of this as you interact with this chatbot and <strong>stop if you feel uncomfortable</strong> at any point during the experience.
          </p>

          <p>
            <small>By continuing, you agree to this website's <a href="/legal/terms-of-use" target="_blank">Terms of Use</a> and <a href="/legal/privacy-policy" target="_blank">Privacy Policy</a>.</small>
          </p>
        </Popup>
      </Container>
    </Layout>
  )
}

const Container = styled.section`
  padding: 20px;
`

export default Home
