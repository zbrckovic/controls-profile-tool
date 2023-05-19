import React, {FC} from 'react'

interface Props {
    className?: string,
    templateFiles: string[],
    value?: string,
    onChange: (value?: string) => void
}

export const TemplateFilePicker: FC<Props> = ({
                                                  className,
                                                  templateFiles,
                                                  value,
                                                  onChange
                                              }) =>
    <select
        className={className}
        value={value === undefined ? '' : value}
        onChange={({target: {value}}) => {
            onChange(value === '' ? undefined : value)
        }}>
        <option value={''}></option>
        {
            Object.keys(templateFiles).map(name =>
                <option key={name} value={name}>{name}</option>
            )
        }
    </select>