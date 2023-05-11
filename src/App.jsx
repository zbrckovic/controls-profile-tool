import React from 'react'

import { importControls } from './importers/dcs-importer'

export const App = () => {
  return <input multiple type="file" onChange={({ target: { files } }) => {
    importControls(files).then(results => {
      console.log(results)
    })
  }}/>
}


