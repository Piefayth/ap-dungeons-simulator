import { Actor } from "../actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../events"
import * as _ from 'lodash'

class HealingReceivedEvent extends Event {
    healingReceived: number
    targetPartyIndex: number
    targetIndex: number

    constructor(healingReceived: number, targetPartyIndex: number, targetIndex: number, triggeredBy: Event) {
        super(EventKind.HEALING_RECEIVED)
        this.healingReceived = healingReceived
        this.targetPartyIndex = targetPartyIndex
        this.targetIndex = targetIndex
    }

    processHealingReceived(partyStates: Actor[][]): ProcessedEventResult {
        let newPartyStates = _.cloneDeep(partyStates)
        let target = newPartyStates[this.targetPartyIndex][this.targetIndex]
    
        let updatedTarget = {
            ...target,
            curHP: Math.min(target.maxHP, target.curHP += this.healingReceived)
        }
    
        newPartyStates[this.targetPartyIndex][this.targetIndex] = updatedTarget
    
        return {
            newPartyStates,
            newEvents: []
        }
    }
}

export {
    HealingReceivedEvent
}