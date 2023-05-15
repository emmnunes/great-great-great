'use client';

import React from "react"
import styled from "styled-components"
import { rem } from "polished"
import { motion } from "framer-motion"
import Button from "../Button"

interface Props {
  keyId: string;
  link?: string;
  action?: Function;
  buttonLabel?: string;
  color: string;
  background: string;
  isVisible: boolean;
  size?: string;
  children?: React.ReactNode;
}

const Popup = (props: Props) => {
  const { keyId, link, action, buttonLabel, color, background, isVisible, size, children } = props;

  let classNames = "color--" + background
  if (size) classNames += " size--" + size

  return (
    <Container
      initial={false}
      animate={isVisible ? "visible" : "hidden"}
      className={classNames}
      key={keyId}
    >
      <PopupBackground
        key={`${keyId}-bg`}
        className="bg"
      />

      <Content key={`${keyId}-content`}>
        <Text key={`${keyId}-text`}>
          {children}
        </Text>

        <Cta key={`${keyId}-cta`}>
          <Button
            link={link}
            action={action}
            color={background}
            background={color}
          >
            {buttonLabel}
          </Button>
        </Cta>

      </Content>
    </Container>
  );
}

const PopupBackground = styled(motion.section).attrs(() => ({
  variants: {
    visible: {
      width: "100%",
      transition: {
        duration: 0.5,
        delay: 0,
        ease: [0.645, 0.045, 0.355, 1.000]
      }
    },
    hidden: {
      width: "0%",
      transition: {
        duration: 0.5,
        delay: 0.5,
        ease: [0.645, 0.045, 0.355, 1.000]
      }
    }
  }
}))``

const Container = styled(motion.section).attrs(() => ({
  variants: {
    visible: {
      opacity: 1,
      pointerEvents: "auto",
      transition: {
        duration: 1,
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    },
    hidden: {
      opacity: 0,
      pointerEvents: "none",
      transition: {
        when: "afterChildren",
        staggerChildren: 0.3
      }
    }
  }
}))`
  overflow-y: auto;
  width: ${rem(640)};
  max-width: 90vw;
  max-height: 90vh;
  padding: ${rem(40)};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media ${({ theme }) => theme.mq.mobileUp} {
    height: ${rem(820)};
  }

  a {
    text-decoration: none;
  }

  ${PopupBackground} {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.colors.milan};
  }

  & > * {
    position: relative;
  }

  p {
    z-index: 1;
    font-size: 3vw;
    font-size: clamp(18px, 3vw, 32px);
    max-width: 36ch;
    margin: 0;

    & + p {
      margin-top: 1em;
    }
  }

  ul {
    list-style-type: none;
    margin: 1.6em 0 0 0;
    padding: 0;

    li {
      ${({ theme }) => theme.fonts.set(`secondary`, `normal`)}

      font-variation-settings: 'wght' 550;
      margin: 0;
      padding: 0.8em 0;
      color: currentColor;

      & + li {
        border-top: 1px solid rgba(0, 0, 255, 0.1);
      }
    }
  }

  a {
    color: currentColor;
    text-decoration: underline;
  }

  &.size--small {
    p {
      font-size: 1vw;
      font-size: clamp(16px, 2vw, 24px);
    }
  }

  &.color--white {
    ${PopupBackground} {
      background: ${({ theme }) => theme.colors.white};
    }

    color: ${({ theme }) => theme.colors.night};
  }

  &.color--milan {
    ${PopupBackground} {
      background: ${({ theme }) => theme.colors.milan};
    }

    color: ${({ theme }) => theme.colors.blue};
  }

  &.color--bisque {
    ${PopupBackground} {
      background: ${({ theme }) => theme.colors.bisque};
    }

    color: ${({ theme }) => theme.colors.blue};
  }

  &.color--mint {
    ${PopupBackground} {
      background: ${({ theme }) => theme.colors.mint};
      color: ${({ theme }) => theme.colors.blue};
    }
  }

  &.color--night {
    ${PopupBackground} {
      background: ${({ theme }) => theme.colors.night};
    }

    color: ${({ theme }) => theme.colors.white};
  }
`

const Content = styled(motion.section)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

const Text = styled(motion.section).attrs(() => ({
  variants: {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.8,
        ease: [0.645, 0.045, 0.355, 1.000]
      }
    },
    hidden: {
      opacity: 0,
      y: 10,
      transition: {
        duration: 0.5,
        delay: 0.2
      }
    }
  }
}))`
  small {
    display: block;
  }
`

const Cta = styled(motion.section).attrs(() => ({
  variants: {
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 1,
        ease: [0.645, 0.045, 0.355, 1.000]
      }
    },
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.5,
        delay: 0
      }
    }
  }
}))`
  margin-top: 3em;

  button {
    display: flex;
    background: none;
    padding: 0;
    border: 0;
    cursor: pointer;
    white-space: nowrap;
  }
`

export default Popup
