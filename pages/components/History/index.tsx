import React, { useRef } from "react"
import styled from "styled-components"
import { rem } from "polished"
import { AnimatePresence, motion } from "framer-motion"

interface Props {
  visible: boolean;
  history: Array<{role: string, content: string}>;
}

const History = (props: Props) => {
  const { visible, history } = props;

  const historyWindowRef = useRef<HTMLDivElement>(null!)

  React.useEffect(() => {
    const elHeight = historyWindowRef.current.scrollHeight

    historyWindowRef.current.scrollTo({
      top: elHeight,
      behavior: 'smooth',
    })
  })

  return (
    <ChatHistory
      ref={historyWindowRef}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
    >
      <Title>History</Title>

      {history &&
        <AnimatePresence>
          {history.slice(3).map(((m, index) => {
            return (
              <MessageBubble role={m.role} key={index}>
                {m.content.split(`\n\n`).map((paragraph, i) => <p key={`p-${index}-${i}`}>{paragraph}</p>)}
              </MessageBubble>
            )
          }))}
        </AnimatePresence>
      }
    </ChatHistory>
  );
}


const ChatHistory = styled(motion.section).attrs(() => ({
  variants: {
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      pointerEvents: "auto",
      transition: {
        duration: 0.3,
        ease: [0.175, 0.885, 0.320, 1.275]
      }
    },
    hidden: {
      opacity: 0,
      y: 10,
      scale: 0.9,
      pointerEvents: "none",
      transition: {
        duration: 0.2,
        ease: [0.600, -0.280, 0.735, 0.045]
      }
    }
  }
}))`
  position: absolute;
  bottom: 90%;
  right: 0;
  width: 55ch;
  max-width: 100%;
  max-height: 80vh;
  background: ${({ theme }) => theme.colors.night};
  padding: 2em;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: -20px 0 40px rgba(0, 0, 0, 0.2);
  border-radius: ${rem(45)};
  transform-origin: 100% 100%;
  z-index: 2;

  @media ${({ theme }) => theme.mq.mobileDown} {
    border-radius: ${rem(20)};
    bottom: 105%;
    max-width: 100%;
    max-height: calc(90vh - 160px);
    padding-left: 1em;
    padding-right: 1em;
    padding-bottom: 0.5em;
  }
`

const Title = styled.h1`
  font-size: ${rem(18)};
  color: ${({ theme }) => theme.colors.bisque};
  margin: 0;
  text-transform: uppercase;
  text-align: center;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  left: 0;
  background: ${({ theme }) => theme.colors.night};
  padding: 1.5em 10% 1em 10%;
  transform: translateY(-35px);
  margin-bottom: -25px;
  box-shadow: 0px 0 10px rgba(28, 11, 25, 1);

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: currentColor;
    opacity: 0.2;
  }
  &::before {
    margin-right: 1em;
  }
  &::after {
    margin-left: 1em;
  }
`

const MessageBubble = styled(motion.div).attrs(() => ({
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
}))`

  font-size: 1vw;
  font-size: clamp(16px, 1vw, 18px);
  font-variation-settings: 'wght' 550;
  border-radius: ${rem(30)};
  padding: 1em 1.2em;
  margin-bottom: 0.5em;

  @media ${({ theme }) => theme.mq.mobileDown} {
    border-radius: ${rem(12)};
  }

  ${(props: { role: string }) => {
    if (props.role === "assistant") {
      return `
        align-self: flex-start;
        color: #1C0B19;
        background: #FFFFFF;
      `
    } else if (props.role === "user") {
      return `
        align-self: flex-end;
        color: #FFFFFF;
        background: #0000FF;
        max-width: 90%;
      `
    }
  }}

  p {
    ${({ theme }) => theme.fonts.set(`secondary`, `normal`)}

    margin: 0;

    & + p {
      margin-top: 0.5em;
    }
  }
`

export default History
