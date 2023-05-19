import React, {FC} from 'react'

interface Props {
    templateFiles: string[],
    value?: string,
    onChange: (value?: string) => void,
    className?: string
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
            templateFiles.map(filename =>
                <option key={filename} value={filename}>{filename}</option>
            )
        }
    </select>