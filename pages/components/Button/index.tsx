'use client';

import React from "react"
import styled from "styled-components"
import { rem } from "polished"
import Link from 'next/link'
import { motion } from "framer-motion"

import ArrowSvg from '-!svg-react-loader!assets/icons/arrow.svg'

interface Props {
  link?: string;
  action?: Function;
  background?: string;
  color?: string;
  size?: string;
  children: React.ReactNode;
}

const Button = (props: Props) => {
  const { link, action, background, color, size, children } = props;

  let classNames = "background--" + background
  if (color) classNames += " color--" + color
  if (size) classNames += " size--" + size

  return (
    <Container
      whileTap="tap"
      whileHover="hover"
    >
      {link &&
        <Link href={link} className={classNames}>
          <Text>
            {children}
          </Text>

          <Icon>
            <ArrowSvg />
          </Icon>
        </Link>
      }

      {action &&
        <Trigger
          className={classNames}
          onClick={() => action()}
        >
          <Text>
            {children}
          </Text>

          <Icon>
            <ArrowSvg />
          </Icon>
        </Trigger>
      }
    </Container>
  );
}

const Trigger = styled.button`
`

const Text =  styled(motion.section).attrs(() => ({
  variants: {
    tap: {
      x: -5
    }
  }
}))`
  ${({ theme }) => theme.fonts.set(`primary`, `bold`)};

  display: block;
  font-size: 2vw;
  font-size: clamp(16px, 2vw, 20px);
  padding: 0 1.5em;
  line-height: ${rem(60)};
  text-transform: uppercase;
  border-radius: ${rem(500)};
  color: ${({ theme }) => theme.colors.milan};
  background: ${({ theme }) => theme.colors.blue};

  @media ${({ theme }) => theme.mq.mobileDown} {
    line-height: ${rem(48)};
    font-size: clamp(14px, 2vw, 16px);
  }
`

const Icon = styled(motion.section).attrs(() => ({
  variants: {
    hover: {
      x: 5
    },
    tap: {
      x: -5
    }
  }
}))`
  height: 100%;
  margin-left: 0.3em;
  display: block;
  color: ${({ theme }) => theme.colors.blue};
  border-radius: 50%;

  svg {
    height: 100%;
    display: block;

    * {
      fill: currentColor;
    }
  }

  @media ${({ theme }) => theme.mq.mobileDown} {
    margin-left: 0.2em;
    height: ${rem(48)};
  }
`

const Container = styled(motion.section).attrs(() => ({
  variants: {
    hover: {
      opacity: 0.8
    }
  }
}))`
  position: relative;

  a {
    display: flex;
    flex-direction: row;
  }

  .background--milan ${Text} {
    background: ${({ theme }) => theme.colors.milan};
  }

  .background--bisque ${Text} {
    background: ${({ theme }) => theme.colors.bisque};
  }

  .color--white {
    ${Text} {
      color: ${({ theme }) => theme.colors.white};
    }

    ${Icon} {
      color: ${({ theme }) => theme.colors.blue};
      border-color: ${({ theme }) => theme.colors.blue};
    }
  }

  .color--night {
    ${Text} {
      color: ${({ theme }) => theme.colors.night};
      background: ${({ theme }) => theme.colors.white};
    }

    ${Icon} {
      color: ${({ theme }) => theme.colors.white};
      border-color: ${({ theme }) => theme.colors.white};
    }
  }

  .color--blue {
    ${Text} {
      color: ${({ theme }) => theme.colors.blue};
    }

    ${Icon} {
      color: ${({ theme }) => theme.colors.blue};
      border-color: ${({ theme }) => theme.colors.blue};
    }
  }

  .color--mint {
    ${Text} {
      color: ${({ theme }) => theme.colors.mint};
    }

    ${Icon} {
      color: ${({ theme }) => theme.colors.blue};
      border-color: ${({ theme }) => theme.colors.blue};
    }
  }

  .color--bisque {
    ${Text} {
      color: ${({ theme }) => theme.colors.bisque};
    }

    ${Icon} {
      color: ${({ theme }) => theme.colors.blue};
      border-color: ${({ theme }) => theme.colors.blue};
    }
  }
`

export default Button
