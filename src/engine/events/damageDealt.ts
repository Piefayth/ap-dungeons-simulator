import { Actor } from "../actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../events"
import * as _ from 'lodash'
import { DamageTakenEvent } from "./damageTaken"


class DamageDealtEvent extends Event {
    damageDealt: number
    targetPartyIndex: number
    targetIndex: number

    constructor(damageDealt: number, targetPartyIndex: number, targetIndex: number, triggeredBy: Event) {
        super(EventKind.DAMAGE_DEALT)
        this.damageDealt = damageDealt
        this.targetPartyIndex = targetPartyIndex
        this.targetIndex = targetIndex
    }

    processDamageDealt(partyStates: Actor[][]): ProcessedEventResult {
        let newPartyStates = _.cloneDeep(partyStates)
        let defender = newPartyStates[this.targetPartyIndex][this.targetIndex]
        let newEvents: Event[] = []
        
        for (let i = 0; i < defender.items.length; i++) {
            const itemResult = defender.items[i].handleOnDamageDealt(newPartyStates, this)
            newPartyStates = itemResult.newPartyStates
            newEvents = newEvents.concat(itemResult.newEvents)
        }
        
        newEvents.unshift(
            new DamageTakenEvent(this.damageDealt, this.targetPartyIndex, this.targetIndex, this)
        )

        return {
            newPartyStates,
            newEvents
        }
    }
}

export {
    DamageDealtEvent
}