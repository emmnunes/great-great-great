import * as THREE from 'three'
import React, { useRef } from 'react'
import { Canvas, useFrame, ThreeElements, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { Preload, Loader } from "@react-three/drei"
import { useRouter } from "next/router"
import styled, { css } from "styled-components"
import { rem } from "polished"
import { AnimatePresence, motion } from "framer-motion"

import { shuffleArray, clamp } from "../../../utils/misc"

import AudioButton from "../AudioButton"

import CloseSvg from '-!svg-react-loader!assets/icons/cross.svg'

const images = shuffleArray([
  "/imgs/01.jpg",
  "/imgs/02.jpg",
  "/imgs/03.jpg",
  "/imgs/04.jpg",
  "/imgs/05.jpg",
  "/imgs/06.jpg",
  "/imgs/07.jpg",
  "/imgs/08.jpg",
  "/imgs/09.jpg",
  "/imgs/10.jpg",
  "/imgs/11.jpg",
  "/imgs/12.jpg",
  "/imgs/13.jpg",
  "/imgs/14.jpg",
])

function Image(props: ThreeElements['mesh']) {
  const mesh = useRef<THREE.Mesh>(null!)
  const [counter, setCounter] = React.useState<number>(0)
  const [activeImage, setActiveImage] = React.useState<number>(0)
  const [rotationVariation, setRotationVariation] = React.useState<number>(0.1)
  const [scaleDirection, setScaleDirection] = React.useState<number>(Math.random())

  type MeshOptions = {
    opacity?: number
    scale?: number
    rotateX?: number
    rotateY?: number
  }

  const [meshOptions, setMeshOptions] = React.useState<MeshOptions>({
    opacity: 0,
    scale: 1,
    rotateX: 0,
    rotateY: 1
  })
  const [imagePosition, setImagePosition] = React.useState<number[]>([0, 0, 0])

  const preloadNextImage = () => {
    const nextImage = (activeImage >= images.length - 1 ? 0 : (activeImage + 1))
    useLoader(TextureLoader, images[nextImage])
  }

  let photoMap = useLoader(TextureLoader, images[activeImage])

  preloadNextImage()

  const randomizeImage = () => {
    setActiveImage(activeImage >= images.length - 1 ? 0: (activeImage + 1))

    const randomNumber = (window.innerWidth > 768)
      ? (3 + Math.random() * 3)
      : (1 + Math.random() * 1)
    const alternateSides = imagePosition[0] > 0 ? -1 : 1

    setImagePosition([randomNumber * alternateSides, -1.5 + Math.random() * 3, 0])
    preloadNextImage()
  }

  useFrame(({ clock }) => {
    // Counts the elapsed time since the last photo change
    // It stores total elapsedTime (for first photo) or time elapsed since
    // last photo change (for subsequent photos).
    const elapsedTime = counter ? clock.oldTime - counter : clock.elapsedTime * 1000
    const duration = 5000
    const fadeDuration = 400
    const delta = duration / fadeDuration

    let newOpacity = meshOptions.opacity

    if (elapsedTime < duration / delta) {
      newOpacity = elapsedTime/duration * delta
    } else if (elapsedTime > duration - fadeDuration) {
      newOpacity = meshOptions.opacity - delta/100
    } else {
      newOpacity = 1
    }

    setMeshOptions({
      opacity: clamp(newOpacity, 0, 1),
      scale: (window.innerWidth > 768)
        ? scaleDirection > 0.5 ? 1.2 - elapsedTime/duration/10 : 1 + elapsedTime/duration/20
        : scaleDirection > 0.5 ? 1 - elapsedTime/duration/10 : 0.8 + elapsedTime/duration/20,
      rotateX: (elapsedTime/duration * rotationVariation)/2,
      rotateY: -elapsedTime/duration * rotationVariation
    })

    mesh.current.rotation.x = meshOptions.rotateX
    mesh.current.rotation.y = meshOptions.rotateY

    if (elapsedTime > duration) {
      randomizeImage()
      setCounter(0)
      setRotationVariation(-0.01 + Math.random()/10)
      setScaleDirection(Math.random())
      setCounter(clock.oldTime)
    }
  })

  return (
    <mesh
      {...props}
      ref={mesh}
      position={imagePosition}
      scale={meshOptions.scale}
      >
      <planeGeometry args={[3.3333, 5, 1]} side={THREE.DoubleSide} />
      <meshStandardMaterial
        map={photoMap}
        opacity={meshOptions.opacity}
        transparent />
    </mesh>
  )
}
interface Props {
  variant: string;
  showCanvas: boolean;
  faders?: string;
}

const Background = (props: Props) => {
  const router = useRouter()
  const { variant, showCanvas, faders } = props;
  const [loaded, setLoaded] = React.useState<boolean>(false)

  React.useEffect(() => {
    if(!loaded)
      setLoaded(true)
  })

  return (
    <>
      <Curtain
        initial="visible"
        animate={loaded ? "hidden" : "visible"}
      />

      <BackgroundCanvas>
        <AnimatePresence>
          {showCanvas && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Canvas linear flat>
                <ambientLight />
                <pointLight position={[0, 0, 0]} />
                <Image />
                <Preload all />
              </Canvas>

              <Loader />
            </motion.span>
          )}
        </AnimatePresence>

        <Title
          initial={false}
          animate={variant}
          version={faders}
        >
          <Heading1
            variant={variant}
            onClick={() => router.push("/") }
          >
            Great
          </Heading1>

          <Heading2
            variant={variant}
            onClick={() => router.push("/") }
          >
            Great
          </Heading2>

          <Heading3
            variant={variant}
            onClick={() => router.push("/") }
          >
            Great
          </Heading3>
        </Title>
      </BackgroundCanvas>

      <Options>
        <AudioButton />

        <AnimatePresence>
          {!showCanvas && (
            <Close
              onClick={() => router.push("/outro") }
            >
              <CloseSvg />
            </Close>
          )}
        </AnimatePresence>
      </Options>
    </>
  );
}

const Title = styled(motion.section).attrs(() => ({
  variants: {
    large: {
      opacity: 1,
      transition: {
        duration: 1,
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    },
    small: {
      opacity: 1,
      transition: {
        duration: 1,
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    },
    hidden: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.3
      }
    }
  }
}))`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;

  &::before,
  &::after {
    content: "";
    display: block;
    position: fixed;
    width: 100%;
    transition: opacity 500ms ease-in;

    height: 8vw;
    height: clamp(150px, 8vw, 200px);
  }

  &::before {
    top: 0;
    left: 0;
    background: linear-gradient(180deg, #F4FCFF 20%, rgba(244, 252, 255, 0) 100%),
      linear-gradient(170deg, #F4FCFF 6%, rgba(244, 252, 255, 0) 50%);
    opacity: ${(props: { version: string }) => props.version === "none" ? "0" : "1"};
  }

  &::after {
    bottom: 0;
    left: 0;
    background: linear-gradient(180deg, rgba(244, 252, 255, 0) 0%, #F4FCFF 80%),
      linear-gradient(0deg, #F4FCFF 20%, rgba(244, 252, 255, 0) 100%);
    opacity: ${(props: { version: string }) => props.version === "full" ? "1" : "0"};

    @media ${({ theme }) => theme.mq.mobileUp} {
      height: clamp(150px, 8vw, 300px);
    }
  }
`

const BackgroundCanvas = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`

const Curtain = styled(motion.div).attrs(() => ({
  variants: {
    visible: {
      x: "0",
      transition: {
        duration: 1,
        delay: 0.6,
        ease: [1, 0, 0, 1]
      }
    },
    hidden: {
      x: "100%",
      transition: {
        duration: 1,
        delay: 0.6,
        ease: [1, 0, 0, 1]
      }
    },
  },
}))`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.blue};
  z-index: 99;
`

const headingStyles = css`
  font-size: 8vw;
  font-size: clamp(24px, 8vw, 140px);
  position: absolute;
  color: ${({ theme }) => theme.colors.blue};
  margin: 0;
  line-height: 1;
  transform-origin: 0 0;
  cursor: pointer;
  pointer-events: auto;

  @media ${({ theme }) => theme.mq.mobileDown} {
    font-size: 20vw;
    transition: margin 400ms ease;
  }
`

const Heading1 = styled(motion.h1).attrs(() => ({
  variants: {
    large: {
      opacity: 1,
      scale: 1,
      top: "50%",
      left: "50%",
      x: "-150%",
      y: "-300%",
      transition: {
        duration: 1.5,
        delay: 2,
        ease: [0.645, 0.045, 0.355, 1.000]
      }
    },
    small: {
      opacity: 1,
      scale: 0.3,
      top: 0,
      left: 0,
      x: "20px",
      y: "50%",
      transition: {
        duration: 0.8,
        ease: [0.645, 0.045, 0.355, 1.000],
        delay: 0
      }
    },
    hidden: {
      opacity: 0,
      scale: 1,
      top: "50%",
      left: "50%",
      x: "-150%",
      y: "-300%",
      transition: {
        duration: 0.4
      }
    }
  }
}))`
  ${headingStyles}

  ${({ theme }) => theme.fonts.set(`primary`, `normal`)}

  @media ${({ theme }) => theme.mq.mobileDown} {
    margin-left: ${(props: { variant: string }) => props.variant === "small" ? "0" : "30%"};
  }
`

const Heading2 = styled(motion.h1).attrs(() => ({
  variants: {
    large: {
      opacity: 1,
      scale: 1,
      top: "50%",
      left: "50%",
      x: "10%",
      y: "-100%",
      transition: {
        duration: 1.5,
        delay: 1.5,
        ease: [0.645, 0.045, 0.355, 1.000]
      }
    },
    small: {
      opacity: 1,
      scale: 0.3,
      top: 0,
      left: 0,
      x: "150%",
      y: "-15%",
      transition: {
        duration: 0.8,
        ease: [0.645, 0.045, 0.355, 1.000],
        delay: 0
      }
    },
    hidden: {
      opacity: 0,
      scale: 1,
      top: "50%",
      left: "50%",
      x: "10%",
      y: "-100%",
      transition: {
        duration: 0.4
      }
    }
  }
}))`
  ${headingStyles}

  ${({ theme }) => theme.fonts.set(`primary`, `bold`)}

  @media ${({ theme }) => theme.mq.mobileDown} {
    margin-left: ${(props: { variant: string }) => props.variant === "small" ? "-45%" : "-25%"};
  }
`

const Heading3 = styled(motion.h1).attrs(() => ({
  variants: {
    large: {
      opacity: 1,
      scale: 1,
      top: "50%",
      left: "50%",
      x: "-130%",
      y: "150%",
      transition: {
        duration: 1.5,
        delay: 1,
        ease: [0.645, 0.045, 0.355, 1.000]
      }
    },
    small: {
      opacity: 1,
      scale: 0.3,
      top: 0,
      left: 0,
      x: "100%",
      y: "15%",
      transition: {
        duration: 0.8,
        ease: [0.645, 0.045, 0.355, 1.000],
        delay: 0
      }
    },
    hidden: {
      opacity: 0,
      scale: 1,
      top: "50%",
      left: "50%",
      x: "-130%",
      y: "150%",
      transition: {
        duration: 0.4
      }
    }
  }
}))`
  ${headingStyles}

  ${({ theme }) => theme.fonts.set(`primary`, `normal`)}
  font-style: italic;

  @media ${({ theme }) => theme.mq.mobileDown} {
    margin-left: ${(props: { variant: string }) => props.variant === "small" ? "-32%" : "25%"};
    margin-top: 0;
  }
`

const Options = styled(motion.section).attrs(() => ({
  variants: {
    large: {
      opacity: 1,
      transition: {
        duration: 1,
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    },
    small: {
      opacity: 1,
      transition: {
        duration: 1,
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    },
    hidden: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.3
      }
    }
  }
}))`
  position: fixed;
  top: ${rem(20)};
  right: ${rem(20)};
  z-index: 10;
  display: flex;
  gap: ${rem(10)};

  @media ${({ theme }) => theme.mq.mobileDown} {
    top: ${rem(10)};
    right: ${rem(10)};
    gap: ${rem(8)};
  }
`

const Close = styled(motion.button).attrs(() => ({
  initial: {
    scale: 0,
    width: "0em",
    transition: {
      duration: 0.4,
      ease: [1, 0, 0, 1]
    }
  },
  animate: {
    scale: 1,
    width: "1em",
    transition: {
      duration: 0.4,
      ease: [1, 0, 0, 1]
    }
  },
  exit: {
    scale: 0,
    width: "0em",
    transition: {
      duration: 0.6,
      ease: [1, 0, 0, 1]
    }
   }
}))`
  padding: 0;
  border: 0;
  background: transparent;
  font-size: ${rem(60)};
  display: flex;
  width: 1em;
  height: 1em;
  color: ${({ theme }) => theme.colors.stack};
  transition: color 200ms ease;
  cursor: pointer;

  @media ${({ theme }) => theme.mq.xxlargeDown} {
    font-size: ${rem(50)};
  }

  @media ${({ theme }) => theme.mq.largeDown} {
    font-size: ${rem(40)};
  }

  svg {
    width: 100%;
    height: 100%;

    * {
      fill: currentColor;
    }
  }

  &:hover {
    color: ${({ theme }) => theme.colors.night};
  }
`

export default Background
