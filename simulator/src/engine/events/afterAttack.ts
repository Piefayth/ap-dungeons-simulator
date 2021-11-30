import { Actor } from "../actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../events"
import { getRandomInt } from "../../util/math"
import { BasicAttackEvent } from "./basicAttack"
import { EndTurnEvent } from "./endTurn"
import { DungeonContext } from "../../simulator"

class AfterAttackEvent extends CombatEvent {
    constructor(triggeredBy: CombatEvent) {
        super(EventKind.AFTER_ATTACK, triggeredBy)
    }

    processAfterAttack(ctx: DungeonContext, parties: Actor[][]): ProcessedEventResult {
        let newEvents: Event[] = [new EndTurnEvent(this.attackerPartyIndex, this.attackerIndex)]

        let attacker = parties[this.attackerPartyIndex][this.attackerIndex]

        for (let i = 0; i < attacker.items.length; i++) {
            const itemOnTargetFinalizedResult = attacker.items[i].handleOnAfterAttack(ctx, parties, this)
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
    AfterAttackEvent
}