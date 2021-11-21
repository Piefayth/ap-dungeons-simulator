import { Actor } from "../actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../events"
import * as _ from 'lodash'
import { DamageDealtEvent } from "./damageDealt"


class DamageTakenEvent extends Event {
    damageTaken: number
    targetPartyIndex: number
    targetIndex: number

    constructor(damageTaken: number, targetPartyIndex: number, targetIndex: number, triggeredBy: DamageDealtEvent) {
        super(EventKind.DAMAGE_TAKEN)
        this.damageTaken = damageTaken
        this.targetPartyIndex = targetPartyIndex
        this.targetIndex = targetIndex
    }

    processDamageTaken(partyStates: Actor[][]): ProcessedEventResult {
        let newPartyStates = _.cloneDeep(partyStates)
        let defender = newPartyStates[this.targetPartyIndex][this.targetIndex]
        let newEvents = []
        
        let updatedDefender = {
            ...defender,
            curHP: Math.max(0, defender.curHP -= this.damageTaken)
        }

        newPartyStates[this.targetPartyIndex][this.targetIndex] = updatedDefender
    
        return {
            newPartyStates,
            newEvents
        }
    }
}

export {
    DamageTakenEvent
}