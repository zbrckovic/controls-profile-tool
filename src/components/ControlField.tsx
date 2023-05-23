import {ControlAssignment} from 'domain/import/control-assignment'
import {Modifiers} from 'domain/modifiers'
import {Control} from 'domain/types'
import groupBy from 'lodash.groupby'
import React, {FC, useMemo} from 'react'

interface Props {
    modifiers: Modifiers,
    controls: Control[];
    assignments: ControlAssignment[];
}

export const ControlField: FC<Props> = ({modifiers, controls, assignments}) => {
    const groupedPerModifierCombo = useMemo(
        () => groupBy(assignments, assignment => assignment.getModifierComboId()),
        [assignments]
    )

    const hasValue = Object.keys(groupedPerModifierCombo).length > 0

    return <div style={{color: hasValue ? 'black' : 'red'}}>
        {hasValue ? Object
            .entries(groupedPerModifierCombo)
            .map(([comboId, controlAssignments]) => {
                    const modifierRepresentations: [Control, string | undefined][] = Object
                        .entries(controlAssignments[0].modifiers)
                        .map(([modifier, owner]) =>
                            owner === undefined
                                ? [modifier, undefined]
                                : [modifier, modifiers.getForOwner(owner)?.[modifier]])

                    return <div key={comboId} style={{display: 'flex'}}>
                        <div style={{flex: '1'}}>
                            {findLongestCommonPrefix(...controlAssignments.map(ca => ca.command))}
                        </div>
                        {
                            modifierRepresentations.length > 0 && <div style={{flex: '0'}}>
                                {
                                    modifierRepresentations.map(([modifier, repr]) =>
                                        <div
                                            style={{fontSize: '20px', fontWeight: 'bold'}}
                                            key={modifier}
                                            title={modifier}
                                        >
                                            {repr}
                                        </div>
                                    )
                                }
                          </div>
                        }
                    </div>
                }
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