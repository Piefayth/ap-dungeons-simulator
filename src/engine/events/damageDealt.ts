import { Actor } from "../actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../events"
import * as _ from 'lodash'
import { DamageTakenEvent } from "./damageTaken"


class DamageDealtEvent extends CombatEvent {
    damageDealt: number
    targetPartyIndex: number
    targetIndex: number

    // TODO: this probably shouldn't be or provide access to a CombatEvent at all
    // It would be incorrect to use some of CombatEvent's properties here
    // Add to this counter the number of minutes you've lost to referencing this.defenderIndex
    // 75 minutes wasted
    constructor(damageDealt: number, targetPartyIndex: number, targetIndex: number, triggeredBy: CombatEvent) {
        super(EventKind.DAMAGE_DEALT, triggeredBy)
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