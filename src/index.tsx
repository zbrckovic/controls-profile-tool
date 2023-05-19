import '@fontsource/saira'
import '@fontsource/saira-condensed'
import {App} from 'App'
import React from 'react'
import {createRoot} from 'react-dom/client'
import 'styles/main.css'

const root = createRoot(document.getElementById('root')!)
root.render(<App/>)
