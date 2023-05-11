import React, { useEffect } from "react"
import Head from 'next/head'
import Router from "next/router"
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider, createGlobalStyle } from "styled-components"
import { AnimatePresence } from 'framer-motion'

import Context from "../context/context"
import Background from "./components/Background"
import Loading from "./components/Loading"

import theme from "../theme"

const App = ({ Component, pageProps }) => {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [variant, setVariant] = React.useState<string>("hidden")
  const [faders, setFaders] = React.useState<string>("none")
  const [showCanvas, setShowCanvas] = React.useState<boolean>(true)

  const handleVariant = (pathname: string) => {
    if (
      pathname === "/"
      || pathname === "/outro"
    ) setVariant("large")
    else setVariant("small")

    if(
      pathname === "/chat"
      || pathname.includes("/legal")
    ) setShowCanvas(false)
    else setShowCanvas(true)

    if(pathname === "/chat")
      setFaders("full")
    else if (pathname.includes("/legal"))
      setFaders("top")
    else
      setFaders("none")
  }

  useEffect(() => {
    handleVariant(Router.router.pathname)

    const start = () => {
      setLoading(true)
    }
    const end = () => {
      setLoading(false)
      handleVariant(Router.router.pathname)
    }

    Router.events.on("routeChangeStart", start)
    Router.events.on("routeChangeComplete", end)
    Router.events.on("routeChangeError", end)

    return () => {
      Router.events.off("routeChangeStart", start)
      Router.events.off("routeChangeComplete", end)
      Router.events.off("routeChangeError", end)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Great Great Great</title>

        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, shrink-to-fit=no" />
        <meta name="description" content="Ever wished you could have a conversation with someone from the past? This chatbot lets you talk to your ancestors. Sort of." />

        <meta property="og:title" content="Great Great Great" />
        <meta property="og:description" content="Ever wished you could have a conversation with someone from the past? This chatbot lets you talk to your ancestors. Sort of." />
        <meta property="og:url" content="https://www.great-great-great.com/" />
        <meta property="og:image" content="/imgs/01.jpg" />
        <meta property="og:locale" content="en" />
        <meta property="og:site_name" content="Great Great Great" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Great Great Great" />
        <meta name="twitter:description" content="Ever wished you could have a conversation with someone from the past? This chatbot lets you talk to your ancestors. Sort of." />
        <meta name="twitter:image" content="/imgs/01.jpg" />

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#f5f485" />
        <meta name="apple-mobile-web-app-title" content="Great Great Great" />
        <meta name="application-name" content="Great Great Great" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />

        <link rel="preload" href="/fonts/Triptych-Roman.woff" as="font" type="font/woff" crossOrigin="" />
        <link rel="preload" href="/fonts/Triptych-Grotesque.woff" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/Triptych-Italick.woff" as="font" type="font/woff" crossOrigin="" />
        <link rel="preload" href="/fonts/Open-Sans.ttf" as="font" type="font/ttf" crossOrigin="" />
      </Head>
      <Context>
        <ThemeProvider theme={theme}>
          <InitialStyles />

          {loading && <Loading />}

          <AnimatePresence>
            <Background key="background" variant={variant} showCanvas={showCanvas} faders={faders} />
            <Component key="component" {...pageProps} />
          </AnimatePresence>

          <Analytics />

        </ThemeProvider>
      </Context>
    </>
  )
}

const InitialStyles = createGlobalStyle`
  @font-face {
    font-family: "Triptych";
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url("/fonts/Triptych-Roman.woff") format("woff");
  }

  @font-face {
    font-family: "Triptych";
    font-style: normal;
    font-weight: 600;
    font-display: swap;
    src: url("/fonts/Triptych-Grotesque.woff") format("woff");
  }

  @font-face {
    font-family: "Triptych";
    font-style: italic;
    font-weight: 400;
    font-display: swap;
    src: url("/fonts/Triptych-Italick.woff") format("woff");
  }

  @font-face {
    font-family: "Open Sans";
    font-weight: 400;
    font-display: swap;
    src: url("/fonts/Open-Sans.ttf") format("truetype");
  }

  * {
    line-height: 1.5;
    text-decoration-thickness: 1px;
    text-underline-offset: em(4);
    box-sizing: border-box;
  }

  *:focus:not(:focus-visible) {
    outline: none;
  }

  html,
  body {
    width: 100%;
    overflow-x: hidden;
    margin: 0;
  }

  html {
    ${({ theme }) => theme.fonts.set(`primary`, `normal`)}

    font-size: 100%;  /* a11y */
    background: ${({ theme }) => theme.colors.zircon};
    color: ${({ theme }) => theme.colors.night};

    font-feature-settings: "dlig", "liga", "calt", 'tnum' on, 'lnum' on;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    font-smoothing: antialiased;
    scroll-behavior: smooth;
  }

  strong {
    ${({ theme }) => theme.fonts.set(`primary`, `bold`)}
  }

  em {
    font-style: italic;
  }

  summary {
    cursor: pointer;
    list-style: none;

    &::-webkit-details-marker {
      display: none;
    }
  }

  audio {
    opacity: 0;
    visibility: hidden;
  }
`

export default App
