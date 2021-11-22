import { Actor } from '../../../simulator/src/engine/actor'
import React, { useState } from 'react'
import { PlayerCard } from './playerCard'

type PartySelectionProps = {
    party: Actor[]
    onUpdate: (party: Actor[]) => void
}

export function PartySelection(props: PartySelectionProps) {
    return (
        <div style={{display: 'flex', flexFlow: 'wrap'}}>
            { props.party.map((actor, index) => 
                <PlayerCard 
                    key={`playerCard${Math.random() * 1000}`}
                    actor={actor} 
                    onUpdate={(updatedActor) => {
                        let updatedParty = [...props.party]
                        updatedParty[index] = updatedActor
                        updatedParty = updatedParty.filter(actor => actor)
                        props.onUpdate(updatedParty)
                    }} 
                />
            ) }
        </div>
    )
}