import React from "react"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import styled from "styled-components"
import { rem } from "polished"
import { motion } from "framer-motion"

import Layout from "../components/Layout"

import PrivacyPolicy from "./content/privacy-policy"
import TermsOfUse from "./content/terms-of-use"

const Legal: NextPage = () => {
  const router = useRouter()
  const { id } = router.query

  const [loaded, setLoaded] = React.useState<boolean>(false)

  React.useEffect(() => {
    if(!loaded) setLoaded(true)
  })

  return (
    <Layout id="privacy-policy">
      <Container
        initial="hidden"
        animate={loaded ? "visible" : "hidden"}
      >
        {id === "privacy-policy" && <PrivacyPolicy />}
        {id === "terms-of-use" && <TermsOfUse />}
      </Container>
    </Layout>
  )
}

const Container = styled(motion.section).attrs(() => ({
  variants: {
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 1.7
      }
    },
    hidden: {
      opacity: 0
    }
  }
}))`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8vw 0 ${rem(150)} 0;
  padding-top: clamp(100px, 8vw, 150px);
  width: ${rem(800)};
  max-width: 90vw;
  margin: 0 auto;

  @media ${({ theme }) => theme.mq.mobileDown} {
    padding: ${rem(100)} 0;
    min-height: 90vh;
  }

  p,
  li {
    color: ${({ theme }) => theme.colors.night};
    font-size: 2vw;
    font-size: clamp(16px, 2vw, 24px);
    margin: 0 0 1.2em 0;
    line-height: 1.4;

    span {
      line-height: 1.333;
    }
  }

  h1, h2, h3 {
    text-transform: uppercase;
  }
`

export default Legal
