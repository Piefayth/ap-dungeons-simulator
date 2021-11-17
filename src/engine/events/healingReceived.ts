import { Actor } from "../actor"
import { Event, EventData } from "../events"
import * as _ from 'lodash'

interface HealingReceivedEventData extends EventData {
    healingReceived: number
    targetPartyIndex: number
    targetIndex: number
}

function processHealingReceived(partyStates: Actor[][], event: Event<HealingReceivedEventData>): Actor[][] {
    let newPartyStates = _.cloneDeep(partyStates)
    let target = newPartyStates[event.eventData.targetPartyIndex][event.eventData.targetIndex]

    let updatedTarget = {
        ...target,
        curHP: Math.min(target.maxHP, target.curHP += event.eventData.healingReceived)
    }

    newPartyStates[event.defenderPartyIndex][event.defenderIndex] = updatedTarget

    return newPartyStates
}

export {
    HealingReceivedEventData,
    processHealingReceived
}