import React, { useCallback, useEffect, useRef, useState } from 'react'

import styles from './HTMLExporter.module.css'
import { templateFiles } from '../../templates'
import { TemplateFilePicker } from './TemplatePicker'
import { createRoot } from 'react-dom/client'
import { ControlField } from '../ControlField'

const DEVICE_ATTRIBUTE = 'data-device'
const CONTROL_ATTRIBUTE = 'data-ctrl'

export const HTMLExporter = ({ deviceConfigs = [] }) => {
  const [templateFilename, setTemplateFilename] = useState(undefined)
  const [deviceTemplates, setDeviceTemplates] = useState({})

  const ref = useCallback(iframeEl => {
    iframeEl.addEventListener('load', () => {
      const doc = iframeEl.contentWindow.document

      const newDeviceTemplatesById = {}
      doc.querySelectorAll(`[${DEVICE_ATTRIBUTE}]`).forEach(el => {
        const templateDeviceId = el.getAttribute(DEVICE_ATTRIBUTE)
        const templateControl = el.getAttribute(CONTROL_ATTRIBUTE)

        let deviceTemplate = newDeviceTemplatesById[templateDeviceId]
        if (deviceTemplate === undefined) {
          deviceTemplate = ({ deviceId: undefined, fields: {} })
          newDeviceTemplatesById[templateDeviceId] = deviceTemplate
        }
        deviceTemplate.fields[templateControl] = createRoot(el)
      })

      setDeviceTemplates(newDeviceTemplatesById)
    })
  }, [])

  useEffect(() => {
    const deviceTemplatesList = Object.values(deviceTemplates)

    if (deviceTemplatesList.some(({ deviceId }) => deviceId === undefined)) return

    const deviceConfigsById = {}
    deviceConfigs.forEach(deviceConfig => {
      deviceConfigsById[deviceConfig.id] = deviceConfig
    })

    deviceTemplatesList.forEach(({ deviceId, fields }) => {
      const deviceConfig = deviceConfigsById[deviceId]

      Object.entries(fields).forEach(([control, field]) => {
        field.render(<ControlField
          control={deviceConfig.mapping[control].command}/>)
      })
    })
  }, [deviceConfigs, deviceTemplates])

  return <div className={styles.root}>
    <TemplateFilePicker
      className={styles.templateFileSelect}
      templateFiles={templateFiles}
      value={templateFilename}
      onChange={setTemplateFilename}/>
    {
      Object.keys(deviceTemplates).length > 0 &&
      <table>
        <thead>
        <tr>
          <th>
            Template Device
          </th>
          <th>
            Imported Device
          </th>
        </tr>
        </thead>
        <tbody>
        {
          Object.entries(deviceTemplates).map(([templateDeviceId, { deviceId }]) =>
            <tr key={templateDeviceId}>
              <td>
                {templateDeviceId}
              </td>
              <td>
                <select
                  value={deviceId === undefined ? '' : deviceId}
                  onChange={({ target: { value } }) => {
                    setDeviceTemplates(old => ({
                      ...old,
                      [templateDeviceId]: {
                        ...old[templateDeviceId],
                        deviceId: value
                      }
                    }))
                  }}>
                  <option value={''}></option>
                  {
                    deviceConfigs.map(deviceConfig =>
                      <option
                        key={deviceConfig.id}
                        value={deviceConfig.id}
                      >
                        {deviceConfig.id}
                      </option>
                    )
                  }
                </select>
              </td>
            </tr>
          )
        }
        </tbody>
      </table>
    }
    {
      templateFilename !== undefined &&
      <iframe
        ref={ref}
        className={styles.templateFilePreview}
        src={templateFiles[templateFilename]}>

      </iframe>
    }
  </div>
}