import React, { Component } from "react"
import styled from "styled-components"
import { rem } from "polished"
import { motion } from "framer-motion"
import uuid from "uuid-random"

import Undersight from '-!svg-react-loader!assets/icons/undersight.svg'

export default class Footer extends Component {
  render() {
    return (
      <motion.div
        key={uuid()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1}}
        transition={{
          duration: 0.5,
          ease: [0, 0.71, 0.2, 1.01]
      }}>
        <Legal>
          <li>
            <a href="/legal/terms-of-use" target="_blank">Terms</a>
          </li>
          <li>
            <a href="/legal/privacy-policy" target="_blank">Privacy</a>
          </li>
        </Legal>

        <Credits href="https://www.undersight.co" target="_blank">
          <Undersight />
        </Credits>
      </motion.div>
    );
  }
}

const Legal = styled.ul`
  position: fixed;
  left: ${rem(20)};
  bottom: ${rem(20)};
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: ${rem(10)};

  li {
    ${({ theme }) => theme.fonts.set(`secondary`, `normal`)}
    font-variation-settings: 'wght' 550;
    font-size: 0.8rem;

    margin: 0;
    padding: 0;
  }

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.blue};
  }
`

const Credits = styled.a`
  position: fixed;
  right: ${rem(20)};
  bottom: ${rem(20)};
  width: ${rem(40)};
  height: auto;

  @media ${({ theme }) => theme.mq.mobileDown} {
    right: ${rem(10)};
    bottom: ${rem(10)};
  }

  svg * {
    fill: #0000FF;
  }
`
