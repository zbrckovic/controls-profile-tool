import React, { useState } from 'react'
import { DCSImporter } from './components/DCSImporter'
import { MappingOverview } from './components/MappingOverview'
import { DeviceConfigsCtx } from './contexts'

export const App = () => {
  const [deviceConfigs, setDeviceConfigs] = useState([])

  return <main>
    <DeviceConfigsCtx.Provider value={deviceConfigs}>
      <DCSImporter onChange={setDeviceConfigs}/>
      <MappingOverview
        deviceConfigs={deviceConfigs}
        onChange={setDeviceConfigs}
        setModifierOwner={(modifier, deviceId) => {
          console.log(modifier, deviceId)
        }}
      />
    </DeviceConfigsCtx.Provider>
  </main>
}


