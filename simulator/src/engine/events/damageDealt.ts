import { Actor } from "../actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../events"
import { DamageTakenEvent } from "./damageTaken"
import { DungeonContext } from "../../simulator"


class DamageDealtEvent extends Event {
    damageDealt: number
    targetPartyIndex: number
    targetIndex: number
    attackerIndex?: number

    constructor(damageDealt: number, targetPartyIndex: number, targetIndex: number, triggeredBy: Event, attackerIndex?: number, ) {
        super(EventKind.DAMAGE_DEALT)
        this.damageDealt = damageDealt
        this.targetPartyIndex = targetPartyIndex
        this.targetIndex = targetIndex
        this.attackerIndex = attackerIndex
    }

    processDamageDealt(ctx: DungeonContext, partyStates: Actor[][]): ProcessedEventResult {
        let defender = partyStates[this.targetPartyIndex][this.targetIndex]
        let newEvents: Event[] = []
        
        for (let i = 0; i < defender.items.length; i++) {
            const itemResult = defender.items[i].handleOnDamageDealt(ctx, partyStates, this)
            partyStates = itemResult.newPartyStates
            newEvents = newEvents.concat(itemResult.newEvents)
        }
        
        newEvents.unshift(
            new DamageTakenEvent(this.damageDealt, this.targetPartyIndex, this.targetIndex, this)
        )

        return {
            newPartyStates: partyStates,
            newEvents
        }
    }
}

export {
    DamageDealtEvent
}