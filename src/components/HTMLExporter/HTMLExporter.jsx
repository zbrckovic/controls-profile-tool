import React, { useCallback, useEffect, useState } from 'react'

const ctx = require.context('templates', false, /\.html$/)

import styles from './HTMLExporter.module.css'

const templates = {}
ctx
  .keys()
  .filter(key => key.startsWith('.'))
  .forEach(key => {
    const name = key.slice(2)
    templates[name] = ctx(key)
  })

export const HTMLExporter = ({ deviceConfigs = [] }) => {
  const [templateName, setTemplateName] = useState(Object.keys(templates)[0])
  const [templateDoc, setTemplateDoc] = useState()

  useEffect(() => {
    if (templateDoc === undefined) return
    console.log(deviceConfigs)

    console.log(templateDoc.getElementsByClassName('bla').length)
  }, [templateDoc, deviceConfigs])


  const ref = useCallback(iframeEl => {
    iframeEl.addEventListener('load', () => {
      setTemplateDoc(iframeEl.contentWindow.document)
    })
  }, [])

  return <div className={styles.root}>
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