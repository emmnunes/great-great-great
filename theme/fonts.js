import { css } from "styled-components"

const families = {
  primary: `"Triptych", "Georgia", "Times New Roman", serif`,
  secondary: `"Open Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif`,
}

const weights = {
  primary: {
    normal: 400,
    bold: 600,
  },
  secondary: {
    normal: 400,
    bold: 800,
  }
}

const set = (family, weight) => {
  try {
    return css`
      font-family: ${families[family]};
      font-weight: ${weights[family][weight]};
    `
  } catch (e) {
    // eslint-disable-next-line no-console
    return console.error(`Undefined font family/weight`, e.message, e.name)
  }
}

const fonts = { set }

export default fonts
