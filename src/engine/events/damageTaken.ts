import { Actor } from "../actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../events"
import * as _ from 'lodash'


class DamageTakenEvent extends CombatEvent {
    damageTaken: number
    targetPartyIndex: number
    targetIndex: number

    constructor(damageTaken: number, targetPartyIndex: number, targetIndex: number, triggeredBy: CombatEvent) {
        super(EventKind.DAMAGE_TAKEN, triggeredBy)
        this.damageTaken = damageTaken
        this.targetPartyIndex = targetPartyIndex
        this.targetIndex = targetIndex

    }

    processDamageTaken(partyStates: Actor[][]): ProcessedEventResult {
        let newPartyStates = _.cloneDeep(partyStates)
        let defender = newPartyStates[this.defenderPartyIndex][this.defenderIndex]
    
        let updatedDefender = {
            ...defender,
            curHP: Math.max(0, defender.curHP -= this.damageTaken)
        }
    
        newPartyStates[this.defenderPartyIndex][this.defenderIndex] = updatedDefender
    
        return {
            newPartyStates,
            newEvents: []
        }
    }
}

export {
    DamageTakenEvent
}