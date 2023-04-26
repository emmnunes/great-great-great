import React, { useContext, KeyboardEvent, useRef } from "react"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import styled, { css } from "styled-components"
import { rem } from "polished"
import { AnimatePresence, motion } from "framer-motion"
import uuid from "uuid-random"

import { UserData } from "../context/context"
import Countries from "../data/countries"

import Popup from "./components/Popup"
import Layout from "./components/Layout"

import ArrowSvg from '-!svg-react-loader!assets/icons/chevron.svg'

const Start: NextPage = () => {
  const router = useRouter()
  const { userData, setUserData } = useContext(UserData)
  const yearInputRef1 = useRef<HTMLInputElement>(null!)
  const yearInputRef2 = useRef<HTMLInputElement>(null!)
  const yearInputRef3 = useRef<HTMLInputElement>(null!)
  const yearInputRef4 = useRef<HTMLInputElement>(null!)

  const [countrySearchValue, setCountrySearchValue] = React.useState<string>(``)
  const [loaded, setLoaded] = React.useState<boolean>(false)
  const [visible, setVisible] = React.useState<boolean>(false)
  const [pickingCountry, setPickingCountry] = React.useState<boolean>(false)
  const [focusedCountry, setFocusedCountry] = React.useState<number>(0)
  const [pickingYear, setPickingYear] = React.useState<boolean>(false)
  const [yearError, setYearError] = React.useState<boolean>(false)

  const selectedCountryRef = useRef<HTMLLIElement>(null!)

  React.useEffect(() => {
    if(!loaded) {
      setTimeout(() => {
        setLoaded(true)
        setVisible(true)

        setUserData({
          ...userData,
          onboarded: true,
          userId: uuid()
        })
      }, 800)
    }
  })

  const openCountryPicker = () => {
    setPickingCountry(true)
  }

  const countryChange = (c: string) => {
    setUserData({
      ...userData,
      country: c
    })
    setPickingCountry(false)
  }

  const countrySearchChange = (c: string) => {
    setCountrySearchValue(c)
    setFocusedCountry(0)
  }

  const handleCountryKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape")
      setPickingCountry(false)

    if ((e.key === "Enter") && (selectedCountryRef.current)) {
      countryChange(selectedCountryRef.current.innerText)
    }

    if(e.key === "ArrowDown") {
      const filteredCountries = Countries.filter(word => word.toUpperCase().startsWith(countrySearchValue.toUpperCase()))

      if(focusedCountry < filteredCountries.length - 1)
        setFocusedCountry(focusedCountry + 1)
    }

    if ((e.key === "ArrowUp") && (focusedCountry > 0))
      setFocusedCountry(focusedCountry - 1)
  }

  const handleYearInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, i: number) => {
    if (
      (e.key === "Backspace")
      && (!(e.target as HTMLInputElement).value)
    ) {
      switch(i) {
        case 2:
            yearInputRef1.current.focus()
          break;
        case 3:
            yearInputRef2.current.focus()
          break;
        case 4:
            yearInputRef3.current.focus()
          break;
      }
    }
  }

  const handleYearInputChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').substring(0, 1)

    if ((parseInt(e.target.value) < 10)) {
      switch(i) {
        case 1:
            yearInputRef2.current.focus()
          break;
        case 2:
            yearInputRef3.current.focus()
          break;
        case 3:
            yearInputRef4.current.focus()
          break;
        case 4:
            yearInputRef4.current.focus()
          break;
      }
    }

    if (yearInputRef1.current.value && yearInputRef2.current.value && yearInputRef3.current.value && yearInputRef4.current.value) {
      const selectedYear = parseInt(`${yearInputRef1.current.value}${yearInputRef2.current.value}${yearInputRef3.current.value}${yearInputRef4.current.value}`)

      if ((selectedYear > 1900) && (selectedYear < 2024)) {
        setUserData({
          ...userData,
          year: selectedYear
        })

        setPickingYear(false)
      } else {
        setYearError(true)
      }
    } else {
      setYearError(false)
    }
  }

  const moveToPath = (p: string) => {
    setVisible(false)

    setTimeout(() => {
      router.push(p)
    }, 1200)
  }

  return (
    <Layout id="index">
      <Container>
        <Popup
          keyId="settings"
          size="small"
          color="blue"
          background="white"
          isVisible={visible}
          action={() => { moveToPath("/chat") }}
          buttonLabel="Start experience"
        >
          <p>
            You can increase the realism of the experience by providing some biographical info about yourself first. This is not required, but helps establish context for the storyline to build upon.
          </p>

          <CountryPicker
            onClick={() => openCountryPicker()}
          >
            <PickerTitle>
              Place of birth
              <ArrowSvg />
            </PickerTitle>
            {(userData.country !== "any") && <PickerValue>{userData.country}</PickerValue>}
          </CountryPicker>

          <YearPicker
            onClick={() => setPickingYear(true)}
          >
            <PickerTitle>
              Birth Year
              <ArrowSvg />
            </PickerTitle>
            {(userData.year !== 0) && <PickerValue>{userData.year}</PickerValue>}
          </YearPicker>
        </Popup>

        <AnimatePresence>
          {pickingCountry &&
            <CountryPickerModal
              key="country-picker"
            >
              <ModalBox>
                <ModalTitle
                  onClick={() => { setPickingCountry(false) }}
                >
                  <ArrowSvg />
                  Your country of birth
                </ModalTitle>

                <input
                  value={countrySearchValue}
                  onChange={(e) => { countrySearchChange(e.target.value) }}
                  onKeyDown={handleCountryKeyDown}
                  onBlur={() => { setFocusedCountry(-1) }}
                  onFocus={() => { setFocusedCountry(0) }}
                  autoFocus
                />

                <CountryList>
                  {Countries.filter(word => word.toUpperCase().startsWith(countrySearchValue.toUpperCase())).map((c, index) =>
                    (focusedCountry === index ? (
                      <li key={index} onClick={() => { countryChange(c)}} className="--focused" ref={selectedCountryRef}>
                      <RadioButton /> {c}
                    </li>) : (
                      <li key={index} onClick={() => { countryChange(c)}}>
                      <RadioButton /> {c}
                    </li>)
                  ))}

                </CountryList>
              </ModalBox>
            </CountryPickerModal>
          }

          {pickingYear &&
            <YearPickerModal
              key="year-picker"
            >
              <ModalBox size="auto">
                <ModalTitle
                  onClick={() => { setPickingYear(false) }}
                >
                  <ArrowSvg />
                  Your birth year
                </ModalTitle>

                <YearInputs
                  className={yearError ? "--error" : ""}
                >
                  <input
                    inputMode="numeric"
                    ref={yearInputRef1}
                    onChange={(e) => { handleYearInputChange(e, 1) }}
                    onKeyDown={(e) => { handleYearInputKeyDown(e, 1) }}
                    autoFocus
                  />

                  <input
                    inputMode="numeric"
                    ref={yearInputRef2}
                    onChange={(e) => { handleYearInputChange(e, 2) }}
                    onKeyDown={(e) => { handleYearInputKeyDown(e, 2) }}
                  />

                  <input
                    inputMode="numeric"
                    ref={yearInputRef3}
                    onChange={(e) => { handleYearInputChange(e, 3) }}
                    onKeyDown={(e) => { handleYearInputKeyDown(e, 3) }}
                  />

                  <input
                    inputMode="numeric"
                    ref={yearInputRef4}
                    onChange={(e) => { handleYearInputChange(e, 4) }}
                    onKeyDown={(e) => { handleYearInputKeyDown(e, 4) }}
                  />
                </YearInputs>

              </ModalBox>
            </YearPickerModal>
          }
        </AnimatePresence>
      </Container>
    </Layout>
  )
}

const Container = styled.section`
  padding: 20px;
`

const PickerButtonTextStyles = css`
  ${({ theme }) => theme.fonts.set(`primary`, `bold`)}
  font-size: 2vw;
  font-size: clamp(16px, 2vw, 20px);
  text-transform: uppercase;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  leading-trim: both;
  text-edge: cap;
  letter-spacing: -0.02em;
  text-transform: uppercase;
`

const PickerTitle = styled.span`
  ${PickerButtonTextStyles}

  color: ${({ theme }) => theme.colors.blue};
`

const PickerValue = styled.span`
  ${PickerButtonTextStyles}

  font-feature-settings: 'tnum' on, 'lnum' on;
`

const PickerButtonStyles = css`
  cursor: pointer;
  position: relative;
  padding: 1em 0;
  border: 0;
  background: transparent;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  transition: padding 400ms ease, background 400ms ease;
  border-radius: ${rem(10)};

  &:hover {
    background: ${({ theme }) => theme.colors.zircon};
    padding: 1em;
  }
`

const CountryPicker = styled.button`
  ${PickerButtonStyles}

  margin-top: 1em;
`

const YearPicker = styled.button`
  ${PickerButtonStyles}
`

const ModalBox = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.white};
  width: ${rem(640)};
  max-width: 90vw;
  height: ${(props: { size: string }) => props.size || `${rem(820)}`};
  max-height: 90vh;
  padding: ${rem(30)} ${rem(40)};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  @media ${({ theme }) => theme.mq.mobileDown} {
    max-width: 100vw;
    max-height: 100vh;
    padding: ${rem(20)};
  }
`

const ModalTitle = styled.h2`
  font-size: 2vw;
  font-size: clamp(16px, 2vw, 20px);
  text-transform: uppercase;
  margin: 0;
  color: ${({ theme }) => theme.colors.blue};
  display: flex;
  align-items: center;
  cursor: pointer;

  svg {
    transform: scaleX(-1);
    margin-right: 0.8em;
  }
`

const RadioButton = styled.div`
  position: relative;
  width: 2em;
  min-width: 2em;
  height: 2em;
  border-radius: 50%;
  border: 2px solid black;
  margin-right: 1em;
`

const CountryPickerModal = styled(motion.div).attrs(() => ({
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.645, 0.045, 0.355, 1.000]
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: [0.645, 0.045, 0.355, 1.000]
    }
  }
}))`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  ${ModalBox} {
    @media ${({ theme }) => theme.mq.mobileDown} {
      padding-bottom: 0;
    }
  }

  &::before {
    content: "";
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.colors.night};
    opacity: 0.8;
    z-index: 0;
  }

  input {
    ${({ theme }) => theme.fonts.set(`primary`, `bold`)}
    font-size: 2vw;
    font-size: clamp(16px, 2vw, 20px);
    width: 100%;
    min-height: ${rem(62)};
    text-transform: uppercase;
    background: ${({ theme }) => theme.colors.white};
    border-radius: ${rem(100)};
    overflow: hidden;
    border: 2px solid ${({ theme }) => theme.colors.stack};;
    padding: ${rem(16)} ${rem(22)};
    margin-top: ${rem(20)};

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.blue};
    }
  }
`

const CountryList = styled.ul`
  list-style: none;
  margin: 1em 0;
  padding: 0;
  overflow-y: scroll;
  flex: 1;
  position: relative;

  @media ${({ theme }) => theme.mq.mobileDown} {
    margin-bottom: 0;
  }

  li {
    ${({ theme }) => theme.fonts.set(`primary`, `bold`)}
    font-size: 2vw;
    font-size: clamp(16px, 2vw, 20px);
    text-transform: uppercase;
    margin: 0;
    padding: 0.5em 1em;
    display: flex;
    align-items: center;
    cursor: pointer;
    border-radius: ${rem(100)};
    position: relative;

    &.--focused,
    &:hover {
      color: ${({ theme }) => theme.colors.blue};

      ${RadioButton}::after {
        content: "";
        position: absolute;
        top: 15%;
        left: 15%;
        width: 70%;
        height: 70%;
        border-radius: 50%;
        background: ${({ theme }) => theme.colors.blue};
      }
    }

    &.--focused {
      background: ${({ theme }) => theme.colors.zircon};
      color: ${({ theme }) => theme.colors.blue};
    }
  }
`

const YearPickerModal = styled(motion.div).attrs(() => ({
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.645, 0.045, 0.355, 1.000]
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: [0.645, 0.045, 0.355, 1.000]
    }
  }
}))`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  &::before {
    content: "";
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.colors.night};
    opacity: 0.8;
    z-index: 0;
  }
`

const YearInputs = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${rem(10)};
  margin-top: ${rem(20)};

  input {
    ${({ theme }) => theme.fonts.set(`primary`, `bold`)}
    flex: 1;
    font-size: 10vw;
    font-size: clamp(24px, 10vw, 80px);
    min-height: ${rem(62)};
    text-transform: uppercase;
    overflow: hidden;
    padding: ${rem(16)} 0;
    text-align: center;
    leading-trim: both;
    text-edge: cap;
    font-feature-settings: 'tnum' on, 'lnum' on;
    overflow: hidden;
    border: 2px solid ${({ theme }) => theme.colors.stack};
    border-right-width: 1px;
    border-left-width: 1px;
    -moz-appearance: textfield;
    border-radius: 0;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    &:first-child {
      border-left-width: 2px;
      border-radius: ${rem(10)} 0 0 ${rem(10)};
    }

    &:last-child {
      border-radius: 0 ${rem(10)} ${rem(10)} 0;
      border-right-width: 2px;
    }

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.blue};
    }
  }

  &.--error input {
    border-color: red;
  }
`

export default Start
