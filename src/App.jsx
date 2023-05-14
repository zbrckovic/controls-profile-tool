import React, { useState } from 'react'
import { DCSImporter } from './components/DCSImporter'
import { MappingsOverview } from './components/MappingsOverview/MappingsOverview'

export const App = () => {
  const [devices, setDevices] = useState([])

  return <main>
    <DCSImporter onChange={setDevices}/>
    <MappingsOverview
      devices={devices}
      onChange={setDevices}
      setModifierOwner={(modifier, deviceId) => {
        console.log(modifier, deviceId)
      }}
    />
  </main>
}


