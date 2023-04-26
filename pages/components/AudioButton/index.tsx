import React, { ReactComponentElement, useRef } from "react"
import styled from "styled-components"
import { rem } from "polished"
import { motion } from "framer-motion"
import uuid from "uuid-random"

import AudioPlayer from "../AudioPlayer"
import SoundOnSvg from '-!svg-react-loader!assets/icons/sound-on.svg'
import SoundOffSvg from '-!svg-react-loader!assets/icons/sound-off.svg'

const AudioButton = () => {
  const BackgroundAudioPlayer = useRef<any>(null!)

  const [loading, setLoading] = React.useState<boolean>(false)
  const [backgroundSrc, setBackgroundSrc] = React.useState<string>('')
  const [backgroundMusic, setBackgroundMusic] = React.useState<boolean>(false)

  const toggleAudioButton = (state: boolean) => {
    setBackgroundMusic(state)
  }

  const toggleAudio = () => {
    if (backgroundMusic) {
      BackgroundAudioPlayer.current.pause()
      setBackgroundMusic(false)
    } else {
      if (backgroundSrc) {
        BackgroundAudioPlayer.current.play()
        setBackgroundMusic(true)
      } else {
        loadAudio()
      }
    }
  }

  const loadAudio = async() => {
    setLoading(true)

    const response = await fetch(
      "/sounds/bg.aac",
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Accept: "audio/mpeg"
        }
      }
    )

    if (response.ok) {
      const blob = await response.blob()
      setBackgroundSrc(URL.createObjectURL(blob))
      setLoading(false)
    }
  }

  return (
    <>
      <Sound
        state={loading ? "loading" : "loaded"}
        animate={backgroundMusic ? "on" : "off"}
        whileHover={backgroundMusic ? "hoverOn" : "hoverOff"}
        onClick={toggleAudio}
      >
        {backgroundMusic ? <SoundOnSvg /> : <SoundOffSvg />}
      </Sound>

      <BackgroundMusic>
        <AudioPlayer src={backgroundSrc} ref={BackgroundAudioPlayer} callback={toggleAudioButton} />
      </BackgroundMusic>
    </>
  )
}

const Sound = styled(motion.div).attrs(() => ({
  variants: {
    on: {
      color: "rgb(255, 255, 255)",
      backgroundColor: "rgb(0, 0, 255)",
      transition: {
        duration: 0.2,
        ease: [0.645, 0.045, 0.355, 1.000]
      }
    },
    off: {
      color: "rgb(244, 252, 255)",
      backgroundColor: "rgb(200, 200, 200)",
      transition: {
        duration: 0.2,
        ease: [0.645, 0.045, 0.355, 1.000],
        delay: 0
      }
    },
    hoverOn: {
      color: "rgb(255, 255, 255)",
      backgroundColor: "rgb(0, 0, 255)",
      transition: {
        duration: 0.2,
        ease: [0.645, 0.045, 0.355, 1.000]
      }
    },
    hoverOff: {
      color: "rgb(244, 252, 255)",
      backgroundColor: "rgb(140, 140, 140)",
      transition: {
        duration: 0.2,
        ease: [0.645, 0.045, 0.355, 1.000],
        delay: 0
      }
    }
  }
}))`
  position: relative;
  font-size: ${rem(60)};
  display: flex;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.stack};
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

  &::after {
    content: "";
    display: ${(props: { state: string }) => props.state === "loading" ? "block" : "none"};
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    border: 2px solid ${({ theme }) => theme.colors.blue};
    border-bottom-color: transparent;
    border-right-color: transparent;
    border-radius: 50%;
    animation: ${({ theme }) => theme.keyframes.rotate} 1s linear infinite;
  }
`

const BackgroundMusic = styled.section`
  position: fixed;
  left: 100%;
  top: 100%;
  opacity: 0;
`

export default AudioButton
