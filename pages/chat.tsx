import React, { useContext, useRef } from "react"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import styled from "styled-components"
import { rem } from "polished"
import { AnimatePresence, motion } from "framer-motion"
import uuid from "uuid-random"

import { UserData } from "../context/context"
import Layout from "./components/Layout"
import AudioPlayerDOM from "./components/AudioPlayer"
import Popup from "./components/Popup"
import History from "./components/History"

import initialPrompts from "../utils/prompts"
import sanitizeResponses from "../utils/sanitize"

import ArrowSvg from '-!svg-react-loader!assets/icons/arrow.svg'
import HistorySvg from '-!svg-react-loader!assets/icons/history.svg'

const Chat: NextPage = () => {
  const router = useRouter()
  const { userData } = useContext(UserData)
  const chatInputRef = useRef<HTMLInputElement>(null!)

  const initialPrompt = initialPrompts(userData.country, userData.year)

  const [value, setValue] = React.useState<string>(``)
  const [voiceSrc, setVoiceSrc] = React.useState<string>('')
  const [loaded, setLoaded] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [flagged, setFlagged] = React.useState<boolean>(false)
  const [disabledInput, setDisabledInput] = React.useState<boolean>(true)

  const [errored, setErrored] = React.useState<boolean>(false)
  const [errorTitle, setErrorTitle] = React.useState<string>(``)
  const [errorMessage, setErrorMessage] = React.useState<string>(``)
  const [errorLink, setErrorLink] = React.useState<string>(``)

  const [completion, setCompletion] = React.useState<string>(``)
  const [completionId, setCompletionId] = React.useState<string>(uuid())

  const [loadedInput, setLoadedInput] = React.useState<boolean>(false)
  const [enabledVoice, setenabledVoice] = React.useState<boolean>(false)
  const [history, setHistory] = React.useState<Array<{role: string, content: string}>>(initialPrompt)
  const [showHistory, setShowHistory] = React.useState<boolean>(false)

  let count: number = 0
  const valueMaxLength: number = 480

  React.useEffect(() => {
    if(userData.onboarded) {
      if(!loaded && userData.onboarded) {
        setLoaded(true)

        setTimeout(() => {
          firstPrompt(`Who are you?`)
        }, 1000)
      }
    } else {
      router.push("/")
    }
  })

  const updateVoice = (source: any) => {
    setVoiceSrc(source)
  }

  const generateVoice = async(text: string) => {
    const response = await fetch('/api/voice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: text }),
    })

    if (response.ok) {
      const blob = await response.blob()
      updateVoice(URL.createObjectURL(blob))
    } else {
      console.log(`Error retrieving audio file.`)
    }
  }

  const pushToHistory = (type: string, message: string) => {
    setHistory((h) => [...h, { role: type, content: message }])
  }

  const handleInput = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
    },
    []
  )

  const preparePrompt = (promptValue: string) => {
    pushToHistory(`user`, promptValue)
  }

  const dealWithOutput = (outputValue: string) => {
    setLoading(false)
    setDisabledInput(false)

    count = 0

    outputValue = sanitizeResponses(outputValue)

    setCompletion(outputValue)
    setCompletionId(uuid())
    enabledVoice && generateVoice(outputValue)
    pushToHistory(`assistant`, outputValue)

    setTimeout(() => {
      if (chatInputRef.current) {
        chatInputRef.current.focus()

        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }
    }, 500)
  }

  const firstPrompt = async(firstPrompt: string) => {
    setLoading(true)
    preparePrompt(firstPrompt)

    const prompt = [...history, { role: `user`, content: firstPrompt }]

    const response = await fetch(`/api/text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: prompt }),
    })
    const data = await response.json()

    if (data.result.choices) {
      dealWithOutput(data.result.choices[0].message.content)
    } else {
      showErrorModal(data.result)
    }

    setTimeout(() => {
      setLoadedInput(true)
    }, 1000)
  }

  const showErrorModal = (data: { title: string, description: string, link: string }) => {
    setShowHistory(false)
    setErrored(true)
    setErrorTitle(data.title)
    setErrorMessage(data.description)
    setErrorLink(data.link)
  }

  const closeErrorModal = () => {
    setErrored(false)

    if (errorLink) {
      setTimeout(() => {
        router.push(errorLink)
      }, 1000)
    }
  }

  const moderateInput = async(input: string) => {
    setCompletion(``)
    setValue(``)
    setDisabledInput(true)
    setCompletionId(uuid())

    setTimeout(() => {
      setLoading(true)
    }, 500)

    const response = await fetch(`/api/moderation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: input }),
    })
    const data = await response.json()

    return data.result.results[0].flagged
  }

  const closeModerationModal = () => {
    setFlagged(false)
    setValue(``)
    setDisabledInput(false)

    setTimeout(() => {
      chatInputRef.current.focus()
    }, 500)
  }

  const submitValue = async () => {
    if(!value) return

    if(value.length > valueMaxLength) {
      setErrored(true)
      setErrorTitle("Oof, that's a moutful...")
      setErrorMessage(`Your message is slightly long. Any chance you could rephrase it so it's under ${valueMaxLength} characters? Remember you can break it down into mulitple messages, if you'd like.`)
      setErrorLink("")
      return
    }

    const breaksModeration = await moderateInput(value)

    if(breaksModeration) {
      setShowHistory(false)
      setDisabledInput(true)
      setFlagged(true)
      setLoading(false)
    } else {
      preparePrompt(value)

      const newMessage = `${value} (Answer as if you were my ancestor)`

      const prompt = [...history, { role: `user`, content: newMessage }]

      const response = await fetch(`/api/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: prompt, user: userData.userId }),
      })
      const data = await response.json()

      if (data.result.choices) {
        dealWithOutput(data.result.choices[0].message.content)
      } else {
        showErrorModal(data.result)
      }
    }
  }

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === `Enter`) {
        submitValue()
      }
    },
    [value]
  )

  return (
    <Layout id="grand">
      {userData.onboarded &&
        <Container>
          <Output>
            <AnimatePresence mode="wait">
              {completion.split(`\n\n`).map((paragraph, i) => {
                return (
                  <motion.p
                    key={`${completionId}-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.645, 0.045, 0.355, 1.000]
                    }}
                  >
                    {paragraph.split(``).map((character, j) => {
                      count++

                      return (
                        <motion.span
                          key={`${completionId}-${i}-${j}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            duration: 0.1,
                            delay: count/200
                          }}
                        >
                          {character}
                        </motion.span>
                      )}
                    )}
                  </motion.p>
                )}
              )}

              {loading &&
                <Typing key={`${completionId}-loading`}>
                  <Dot />
                  <Dot delay="200ms" />
                  <Dot delay="400ms" />
                </Typing>}
            </AnimatePresence>
          </Output>

          <Input
            initial="hidden"
            animate={loadedInput && (disabledInput ? "disabled" : "enabled")}
          >
            <InputWrapper>
              <input
                ref={chatInputRef}
                value={value}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                disabled={disabledInput}
                maxLength={valueMaxLength}
                placeholder="Write here..."
              />

              <SubmitButton
                initial="hidden"
                animate={disabledInput ? "hidden" : value ? "enabled" : "disabled"}
                whileHover={value ? "hover" : "disabled"}
                onClick={submitValue}
              >
                <ArrowSvg />
                <span>Send message</span>
              </SubmitButton>
            </InputWrapper>

            <HistoryButton
              initial="hidden"
              animate={history.length < 5 ? "hidden" : showHistory ? "toggled" : "untoggled"}
              onClick={() => setShowHistory(!showHistory)}
            >
              <HistorySvg />
              <span>Chat History</span>
            </HistoryButton>

            <History visible={showHistory} history={history} />
          </Input>

          {enabledVoice && <Audio>
            <AudioPlayerDOM src={voiceSrc} />
          </Audio>}

          <Popup
            keyId="warning"
            size="small"
            color="white"
            background="bisque"
            isVisible={flagged}
            action={closeModerationModal}
            buttonLabel="Ok"
          >
            <p>
              ☝️ <strong>Hold on</strong> a second...
            </p>
            <p>
              Though only a virtual chatbot, your ancestor would probably still prefer to keep the discussion light, friendly and enjoyable. Please make sure your messages are appropriate and comply with our terms of use. Thanks!
            </p>

            <p>
              <small>For more information, please refer to the <a href="/legal/terms-of-use" target="_blank">Terms of Use</a>.</small>
            </p>
          </Popup>

          <Popup
            keyId="error"
            size="small"
            color="blue"
            background="mint"
            isVisible={errored}
            action={() => closeErrorModal()}
            buttonLabel="Ok"
          >
            <p>
              <strong>{errorTitle}</strong>
            </p>
            <p>
              {errorMessage}
            </p>
          </Popup>
        </Container>
      }
    </Layout>
  )
}

const Container = styled.section``

const Input = styled(motion.section).attrs(() => ({
  variants: {
    enabled: {
      opacity: 1,
      x: "-50%",
      y: "0%",
      pointerEvents: "auto",
      transition: {
        duration: 1,
        ease: [1, 0, 0, 1]
      }
    },
    disabled: {
      opacity: 0.2,
      x: "-50%",
      y: "0%",
      pointerEvents: "none",
      transition: {
        duration: 0.4,
        ease: [1, 0, 0, 1]
      }
    },
    hidden: {
      opacity: 0,
      x: "-50%",
      y: "150%",
      pointerEvents: "none",
      transition: {
        duration: 0.4,
        delay: 0.2,
        ease: [1, 0, 0, 1]
      }
    }
  }
}))`
  position: fixed;
  bottom: 2vmin;
  left: 50%;
  width: 92vw;
  max-width: ${rem(1800)};
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: ${rem(15)};

  @media ${({ theme }) => theme.mq.mobileDown} {
    bottom: 1vw;
    width: 98vw;
    gap: ${rem(5)};
    flex-direction: row-reverse;
    align-items: stretch;
  }
`

const InputWrapper = styled.div`
  position: relative;
  flex: 1;

  @media ${({ theme }) => theme.mq.mobileDown} {
    width: 98%;
  }

  input {
    ${({ theme }) => theme.fonts.set(`secondary`, `normal`)}

    width: 100%;
    font-variation-settings: 'wght' 500;
    box-sizing: border-box;
    background: ${({ theme }) => theme.colors.white};
    box-shadow: 0px 20px 60px rgba(0, 0, 0, 0.2),
      0px 30px 30px rgba(244, 252, 255, 0.2);
    border-radius: ${rem(100)};
    overflow: hidden;
    border: 0;
    padding: ${rem(20)} ${rem(100)} ${rem(20)} ${rem(40)};
    font-size: 2.5vmin;
    line-height: 2em;
    border: 2px solid ${({ theme }) => theme.colors.stack};
    transition: box-shadow 1s ease, border 100ms ease-out, opacity 500ms ease-out;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.blue};
      box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.3),
        0px 30px 30px rgba(255, 228, 197, 0.3),
        0px 0px 20px 10px #FFFFFF;
    }

    &:disabled {
      box-shadow: 0px 20px 60px rgba(0, 0, 0, 0),
      0px 30px 30px rgba(255, 228, 197, 0);
    }

    @media ${({ theme }) => theme.mq.mobileDown} {
      border-radius: ${rem(10)};
      padding: ${rem(15)} ${rem(60)} ${rem(15)} ${rem(20)};
      font-size: ${rem(16)};
      font-variation-settings: 'wght' 600;
    }
  }
`

const SubmitButton = styled(motion.button).attrs(() => ({
  variants: {
    hover: {
      x: "0%",
      y: "-50%",
      cursor: "pointer",
      opacity: 1,
      color: "rgb(28, 11, 25)",
      transition: {
        duration: 0.2,
      }
    },
    enabled: {
      x: "0%",
      y: "-50%",
      cursor: "pointer",
      opacity: 1,
      color: "rgb(0, 0, 255)",
      transition: {
        duration: 0.4,
        ease: [1, 0, 0, 1]
      }
    },
    disabled: {
      x: "0%",
      y: "-50%",
      cursor: "not-allowed",
      opacity: 1,
      color: "rgb(140, 140, 140)",
      transition: {
        duration: 0.4,
        ease: [1, 0, 0, 1]
      }
    },
    hidden: {
      x: "-10%",
      y: "-50%",
      opacity: 0,
      color: "rgb(140, 140, 140)",
      transition: {
        duration: 0.4,
        ease: [1, 0, 0, 1]
      }
    }
  }
}))`
  font-size: 60px;
  border: 0;
  outline: 0;
  border-radius: ${rem(500)};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.blue};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: transparent;
  position: absolute;
  top: 50%;
  right: 0;
  margin-right: 0.4em;
  max-height: 70%;
  width: 1em;
  height: 1em;

  @media ${({ theme }) => theme.mq.mobileDown} {
    font-size: 40px;
    margin-right: 0.2em;
  }

  svg {
    width: 100%;
    height: 100%;

    * {
      fill: currentColor;
    }
  }

  span {
    position: absolute;
    right: -1000%;
    visibility: hidden;
  }
`

const HistoryButton = styled(motion.button).attrs(() => ({
  variants: {
    toggled: {
      scale: 1,
      width: "1em",
      height: "1em",
      color: "rgb(255, 255, 255)",
      backgroundColor: "rgb(28, 11, 25)",
      transition: {
        duration: 0.4,
        ease: [1, 0, 0, 1]
      }
    },
    untoggled: {
      scale: 1,
      width: "1em",
      height: "1em",
      color: "rgb(255, 255, 255)",
      backgroundColor: "rgb(0, 0, 255)",
      transition: {
        duration: 0.8,
        ease: [1, 0, 0, 1]
      }
    },
    hidden: {
      scale: 0,
      width: "0em",
      height: "0em",
      color: "rgb(255, 255, 255)",
      backgroundColor: "rgb(0, 0, 255)",
      transition: {
        duration: 0.4,
        ease: [1, 0, 0, 1]
      }
    }
  }
}))`
  font-size: 60px;
  border: 0;
  outline: 0;
  border-radius: ${rem(500)};
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  @media ${({ theme }) => theme.mq.mobileDown} {
    font-size: 40px;
    height: auto !important;
  }

  svg {
    width: 50%;
    height: 50%;

    @media ${({ theme }) => theme.mq.mobileDown} {
      width: 60%;
      height: auto;
    }

    * {
      fill: currentColor;
    }
  }

  span {
    position: absolute;
    right: -1000%;
    visibility: hidden;
  }
`

const Audio = styled.section`
  position: fixed;
  left: 100%;
  top: 100%;
  opacity: 0;
`

const Output = styled.section`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8vw 0 ${rem(150)} 0;
  padding-top: clamp(100px, 8vw, 150px);

  @media ${({ theme }) => theme.mq.mobileDown} {
    padding: ${rem(100)} 0;
    min-height: 90vh;
  }

  p {
    color: ${({ theme }) => theme.colors.night};
    width: 90vw;
    font-size: 3vw;
    font-size: clamp(24px, 3vw, 54px);
    max-width: 50ch;
    margin: 0 auto 1.2em auto;
    line-height: 1.4;

    span {
      line-height: 1.333;
    }
  }
`

const Dot = styled(motion.div).attrs(() => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}))`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.white};
  animation-name: ${({ theme }) => theme.keyframes.dotAnimation};
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-delay: ${(props: { delay: string }) => props.delay || "0"};
`

const Typing = styled(motion.div).attrs(() => ({
  initial: { opacity: 0, width: "80px" },
  animate: { opacity: 1, width: "100px" },
  exit: { opacity: 0, width: "80px" }
}))`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -100%);
  background: ${({ theme }) => theme.colors.blue};
  height: ${rem(50)};
  border-radius: ${rem(50)};
`

export default Chat
