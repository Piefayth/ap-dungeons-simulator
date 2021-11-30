import { Actor } from "../actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../events"
import { getRandomInt } from "../../util/math"
import { BasicAttackEvent } from "./basicAttack"
import { DungeonContext } from "../../simulator"

class TargetFinalizedEvent extends CombatEvent {
    constructor(attackerPartyIndex: number, attackerIndex: number, defenderPartyIndex: number, defenderIndex: number) {
        super(EventKind.TARGET_FINALIZED, attackerPartyIndex, attackerIndex, defenderPartyIndex, defenderIndex)
    }

    processTargetFinalized(ctx: DungeonContext, parties: Actor[][]): ProcessedEventResult {
        let newEvents: Event[] = [new BasicAttackEvent(this)]

        let attacker = parties[this.attackerPartyIndex][this.attackerIndex]

        for (let i = 0; i < attacker.items.length; i++) {
            const itemOnTargetFinalizedResult = attacker.items[i].handleOnTargetFinalized(ctx, parties, this)
            newEvents = newEvents.concat(itemOnTargetFinalizedResult.newEvents)
            parties = itemOnTargetFinalizedResult.newPartyStates
        }

        return {
            newPartyStates: parties,
            newEvents
        }
    }
}

export {
    TargetFinalizedEvent
}