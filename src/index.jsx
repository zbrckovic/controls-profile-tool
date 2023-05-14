import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import 'styles/main.css'

import '@fontsource/saira'
import '@fontsource/saira-condensed'

const root = createRoot(document.getElementById('root'))
root.render(<App/>)
