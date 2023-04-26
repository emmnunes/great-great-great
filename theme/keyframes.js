import { keyframes } from "styled-components"
import { rem } from "polished"

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`

const slideInY = (pos = 20) => keyframes`
  0% {
    transform: translateY(${rem(pos)});
  }

  100% {
    transform: translateY(0);
  }
`

const slideInX = (pos = 20) => keyframes`
  0% {
    transform: translateX(${rem(pos)});
  }

  100% {
    transform: translateY(0);
  }
`

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`

const dotAnimation = keyframes`
  0% { transform: translateY(0); }
  10% { transform: translateY(0); }
  50% { transform: translateY(-25%); }
  56% { transform: translateY(25%); }
  90% { transform: translateY(0); }
  100% { transform: translateY(0); }
`

const keyframesSet = {
  fadeIn,
  slideInY,
  slideInX,
  rotate,
  dotAnimation
}

export default keyframesSet
