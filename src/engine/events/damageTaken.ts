import { Actor } from "../actor"
import { Event, EventData } from "../events"
import * as _ from 'lodash'

interface DamageTakenEventData extends EventData {
    damageTaken: number
}

function processDamageTaken(partyStates: Actor[][], event: Event<DamageTakenEventData>): Actor[][] {
    let newPartyStates = _.cloneDeep(partyStates)
    let defender = newPartyStates[event.defenderPartyIndex][event.defenderIndex]
    let attacker = newPartyStates[event.attackerPartyIndex][event.attackerIndex]

    let updatedDefender = {
        ...defender,
        curHP: Math.max(0, defender.curHP -= event.eventData.damageTaken)
    }

    newPartyStates[event.defenderPartyIndex][event.defenderIndex] = updatedDefender

    return newPartyStates
}

export {
    DamageTakenEventData,
    processDamageTaken
}