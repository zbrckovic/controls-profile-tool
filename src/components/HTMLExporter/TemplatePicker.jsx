import React from 'react'

export const TemplateFilePicker = ({
  className,
  templateFiles,
  value,
  onChange
}) =>
  <select
    className={className}
    value={value === undefined ? '' : value}
    onChange={({ target: { value } }) => {
      onChange(value === '' ? undefined : value)
    }}>
    <option value={''}></option>
    {
      Object.keys(templateFiles).map(name =>
        <option key={name} value={name}>{name}</option>
      )
    }
  </select>