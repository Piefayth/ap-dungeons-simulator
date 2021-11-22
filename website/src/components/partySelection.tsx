import { Actor } from '../../../simulator/src/engine/actor'
import React, { useState } from 'react'
import { PlayerCard } from './playerCard'

type PartySelectionProps = {
    defaultParty: Actor[]
    onUpdate: (party: Actor[]) => void
}

export function PartySelection(props: PartySelectionProps) {
    const [party, setParty] = useState(props.defaultParty)
    
    return (
        <div style={{display: 'flex', flexFlow: 'wrap'}}>
            { party.map((actor, index) => 
                <PlayerCard 
                    key={`playerCard${index}`}
                    actor={actor} 
                    onUpdate={(updatedActor) => {
                        const updatedParty = [...party]
                        updatedParty[index] = updatedActor
                        setParty([...updatedParty])
                    }} 
                />
            ) }
        </div>
    )
}