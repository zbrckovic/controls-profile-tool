import {ControlAssignment} from 'domain/import/control-assignment'
import {Control} from 'domain/types'
import groupBy from 'lodash.groupby'
import React, {FC, useMemo} from 'react'

interface Props {
    controls: Control[];
    assignments: ControlAssignment[];
}

export const ControlField: FC<Props> = ({controls, assignments}) => {
    const groupedPerModifierCombo = useMemo(
        () => groupBy(assignments, assignment => assignment.getModifierComboId()),
        [assignments]
    )

    const hasValue = Object.keys(groupedPerModifierCombo).length > 0

    return <div style={{color: hasValue ? 'black' : 'red'}}>
        {hasValue ? Object
            .entries(groupedPerModifierCombo)
            .map(([comboId, controlAssignments]) =>
                <div key={comboId}>
                    {findLongestCommonPrefix(...controlAssignments.map(ca => ca.command))}
                </div>
            ) : controls.join(';')}
    </div>
}


const findLongestCommonPrefix = (...strings: string[]) => {
    if (strings.length === 0) return ''

    const [first, ...rest] = strings

    let result = ''

    for (let i = 0; i < first.length; i++) {
        const c = first[i]
        if (rest.some(s => s[i] !== c)) return result
        result += c
    }

    return result
}