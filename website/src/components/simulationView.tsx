import { RouteComponentProps, useNavigate } from '@reach/router'
import React, { Props, useState } from 'react'
import { Button } from 'antd'
import { SimulationResult } from '../../../simulator/src/simulator'

export function SimulationView(props: RouteComponentProps) {
    const result = props.location.state as SimulationResult
    const navigate = useNavigate()

    /*
        components
            trial selection
            turn selection
            parties display
                maybe one component for each party
                then one component for each actor
            combat message display
    */

    return (
        <>
            <div style={{marginTop: 20, marginLeft: 20}}>
                <Button type="primary" onClick={() => {
                    navigate('./')
                }}>
                    {`<--`}
                </Button>
            </div>

            <div style={{margin: 20, backgroundColor: 'black'}}>
                
            </div>
        </>
    )
}