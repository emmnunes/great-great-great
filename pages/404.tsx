import React from "react"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import styled from "styled-components"

import Layout from "./components/Layout"
import Popup from "./components/Popup"

const NotFound: NextPage = () => {
  const [loaded, setLoaded] = React.useState<boolean>(false)

  React.useEffect(() => {
    if(!loaded) setLoaded(true)
  })

  return (
    <Layout id="index">
      <Container>
        <Popup
          keyId="intro"
          color="blue"
          background="bisque"
          isVisible={loaded}
          link="/"
          buttonLabel="Back to start"
        >
          <p>
            404<br />
            This page is... not that great.
          </p>
        </Popup>
      </Container>
    </Layout>
  )
}

const Container = styled.section`
  padding: 20px;
`

export default NotFound
