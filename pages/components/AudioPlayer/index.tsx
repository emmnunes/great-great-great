import React, { forwardRef, useImperativeHandle, useRef } from "react"
import { getMobileOS } from "../../../utils/misc"

interface Props {
  src: string,
  callback?: Function
}

const AudioPlayer = forwardRef((props: Props, ref) => {
  const { src, callback } = props;
  const newSrc = ""

  const audioRef = useRef<HTMLAudioElement>(null!)
  const sourceRef = useRef<HTMLSourceElement>(null!)

  useImperativeHandle(ref, () => ({
    pause() {
      audioRef.current.pause()
    },
    play() {
      audioRef.current.play()
    },
    playing() {
      return !audioRef.current.paused
    }
  }))

  React.useEffect(() => {
    if ((src) && (src !== sourceRef.current.src)) {
      sourceRef.current.src = src
      audioRef.current.load()

      // Wonky workaround for iOS' auto-play prevention feature
      if (getMobileOS() !== "iOS") {
        audioRef.current.play()
        if (callback) callback(true)
      }
    }
  })

  return (
    <div style={{opacity: 0}}>
      <audio controls ref={audioRef} loop>
        <source src={newSrc} ref={sourceRef} />
      </audio>
    </div>
  )
})

export default AudioPlayer
