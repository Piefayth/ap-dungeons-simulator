import { Actor } from "../actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../events"
import cloneDeep from 'lodash/cloneDeep'
import { getRandomInt } from "../../util/math"
import { BasicAttackEvent } from "./basicAttack"
import { DungeonContext } from "../../simulator"

class TargetFinalizedEvent extends CombatEvent {
    constructor(attackerPartyIndex: number, attackerIndex: number, defenderPartyIndex: number, defenderIndex: number) {
        super(EventKind.TARGET_FINALIZED, attackerPartyIndex, attackerIndex, defenderPartyIndex, defenderIndex)
    }

    processTargetFinalized(ctx: DungeonContext, parties: Actor[][]): ProcessedEventResult {
        let newPartyStates = cloneDeep(parties)
        
        let newEvents: Event[] = [new BasicAttackEvent(this)]

        let attacker = newPartyStates[this.attackerPartyIndex][this.attackerIndex]

        for (let i = 0; i < attacker.items.length; i++) {
            const itemOnTargetFinalizedResult = attacker.items[i].handleOnTargetFinalized(ctx, newPartyStates, this)
            newEvents = newEvents.concat(itemOnTargetFinalizedResult.newEvents)
            newPartyStates = itemOnTargetFinalizedResult.newPartyStates
        }

        return {
            newPartyStates,
            newEvents
        }
    }
}

export {
    TargetFinalizedEvent
}