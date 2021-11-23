import { Actor } from "../actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../events"
import { DamageDealtEvent } from "./damageDealt"
import cloneDeep from 'lodash/cloneDeep'
import { DungeonContext } from "../../simulator"


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

    processDamageTaken(ctx: DungeonContext, partyStates: Actor[][]): ProcessedEventResult {
        let newPartyStates = cloneDeep(partyStates)
        let defender = newPartyStates[this.targetPartyIndex][this.targetIndex]
        let newEvents = []
        
        let updatedDefender = {
            ...defender,
            curHP: Math.max(0, defender.curHP - this.damageTaken)
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