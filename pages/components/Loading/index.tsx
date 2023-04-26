import React, { Component } from "react"
import styled from "styled-components"
import { rem } from "polished"
import { motion } from "framer-motion"
import uuid from "uuid-random"

export default class Loading extends Component {
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
        <Loader>
          Loading...
        </Loader>
      </motion.div>
    );
  }
}

const Loader = styled.section`
  text-indent: 200vw;
  position: fixed;
  top: ${rem(20)} ;
  left: ${rem(20)} ;
  width: ${rem(50)};
  height: ${rem(50)};
  border: 2px solid ${({ theme }) => theme.colors.blue};
  border-bottom-color: transparent;
  border-right-color: transparent;
  border-radius: 50%;
  z-index: 2;
  animation: ${({ theme }) => theme.keyframes.rotate} 1s linear infinite;
`
