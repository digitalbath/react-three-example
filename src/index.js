import React from 'react'
import ReactDOM from 'react-dom'
import { setup } from 'twind/shim'
import * as colors from 'twind/colors'
import './styles.css'

import App from './App'
import Description from './Description'

setup({
  theme: {
    extend: { colors },
  },
})

ReactDOM.render(
  <>
    <App />
    <Description />
  </>,
  document.getElementById('root')
)
