import React, { useCallback, useEffect, useRef, useState } from 'react'

const ctx = require.context('templates', false, /\.html$/)

import styles from './HTMLExporter.module.css'

const DEVICE_ATTRIBUTE = 'data-device'
const CONTROL_ATTRIBUTE = 'data-ctrl'

const templates = {}
ctx
  .keys()
  .filter(key => key.startsWith('.'))
  .forEach(key => {
    const name = key.slice(2)
    templates[name] = ctx(key)
  })

export const HTMLExporter = ({
  deviceConfigs = []
}) => {
  const [templateName, setTemplateName] = useState(Object.keys(templates)[0])
  const [elementsAndTemplateDevices, setElementsAndTemplateDevices] = useState()

  const ref = useCallback(iframeEl => {
    iframeEl.addEventListener('load', () => {
      const doc = iframeEl.contentWindow.document
      const elements = doc.querySelectorAll(`[${DEVICE_ATTRIBUTE}]`)
      const templateDevices = {}

      elements.forEach(el => {
        const device = el.getAttribute(DEVICE_ATTRIBUTE)
        templateDevices[device] = undefined
      })

      setElementsAndTemplateDevices({
        elements,
        templateDevices
      })
    })
  }, [])

  useEffect(() => {
    if (elementsAndTemplateDevices === undefined) return
    const {elements, templateDevices} = elementsAndTemplateDevices

    const importedDevices = Object.values(templateDevices)

    if (importedDevices.some(device => device === undefined)) return


    const deviceConfigsById = {}
    deviceConfigs.forEach(deviceConfig => {
      deviceConfigsById[deviceConfig.id] = deviceConfig
    })

    elements.forEach(element => {
      const templateDevice = element.getAttribute(DEVICE_ATTRIBUTE)
      const control = element.getAttribute(CONTROL_ATTRIBUTE)

      const importedDevice = templateDevices[templateDevice]
      const device = deviceConfigsById[importedDevice]

      const commandConfig = device.mapping[control]
      element.innerHTML = commandConfig?.command
    })
  }, [elementsAndTemplateDevices])

  return <div className={styles.root}>
    {
      elementsAndTemplateDevices !== undefined &&
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
          Object.entries(elementsAndTemplateDevices.templateDevices).map(([templateDevice, importedDevice]) =>
            <tr key={templateDevice}>
              <td>
                {templateDevice}
              </td>
              <td>
                <select
                  value={importedDevice === undefined ? '' : importedDevice}
                  onChange={({ target: { value } }) => {
                    setElementsAndTemplateDevices(old => ({
                      ...old,
                      templateDevices: {
                        ...old.templateDevices,
                        [templateDevice]: value
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
    <select
      className={styles.select}
      value={templateName === undefined ? '' : templateName}
      onChange={({ target: { value } }) => {
        setTemplateName(value === '' ? undefined : value)
      }}>
      <option value={''}></option>
      {
        Object.entries(templates).map(([name, url]) =>
          <option key={name} value={name}>{name}</option>
        )
      }
    </select>
    {
      templateName !== undefined &&
      <iframe
        ref={ref}
        className={styles.preview}
        src={templates[templateName]}>

      </iframe>
    }
  </div>
}