import { motion } from "framer-motion"
import styled from "styled-components"

const Layout = ({ children, id }) => (
  <LayoutWrapper
    key={id}
  >
    {children}
  </LayoutWrapper>
)

const LayoutWrapper = styled(motion.div).attrs(() => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    ease: "easeIn",
    duration: 0.5
  }
}))``

export default Layout
