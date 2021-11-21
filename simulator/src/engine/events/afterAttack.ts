import { Actor } from "../actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../events"
import { getRandomInt } from "../../util/math"
import { BasicAttackEvent } from "./basicAttack"
import { EndTurnEvent } from "./endTurn"
import cloneDeep from 'lodash/cloneDeep'

class AfterAttackEvent extends CombatEvent {
    constructor(triggeredBy: CombatEvent) {
        super(EventKind.AFTER_ATTACK, triggeredBy)
    }

    processAfterAttack(parties: Actor[][]): ProcessedEventResult {
        let newPartyStates = cloneDeep(parties)
        let newEvents: Event[] = [new EndTurnEvent(this.attackerPartyIndex, this.attackerIndex)]

        let attacker = newPartyStates[this.attackerPartyIndex][this.attackerIndex]

        for (let i = 0; i < attacker.items.length; i++) {
            const itemOnTargetFinalizedResult = attacker.items[i].handleOnAfterAttack(newPartyStates, this)
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
    AfterAttackEvent
}