import React from 'react'

export function MappingsOverview ({ devices = [] }) {
  return <div>
    {devices.map(function ({ id, name, mapping }) {
      return <Device key={id} id={id} name={name} mapping={mapping}/>
    })}
  </div>
}

export function Device ({ name, id, mapping = {} }) {
  return <div style={{ border: '1px solid red', width: '500px', display: 'flex', flexDirection: 'column' }}>
    <dl>
      <dt>Name</dt>
      <dd>{name ?? 'unrecognized'}</dd>

      <dt>Id</dt>
      <dd>{id}</dd>
    </dl>
    <pre>
      {
        JSON.stringify(mapping, undefined, 4)
      }
    </pre>
  </div>
}