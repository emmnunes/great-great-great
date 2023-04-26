import { css } from "styled-components"
import { rem } from "polished"

const widths = {
  xnarrow: 768,
  narrow: 1024,
  normal: 1240,
  wide: 1600,
  xwide: 1920,
}

const gutter = 20

const container = (maxWidth = false) => css`
  width: 100%;
  padding-left: ${rem(gutter)};
  padding-right: ${rem(gutter)};
  margin-left: auto;
  margin-right: auto;

  ${maxWidth &&
  css`
    max-width: ${rem(
      typeof maxWidth === `string` ? widths[maxWidth] : maxWidth
    )};
  `}

  @media ${({ theme }) => theme.mq.mobileDown} {
    padding-left: ${rem(gutter / 2)};
    padding-right: ${rem(gutter / 2)};
  }
`

export default container
