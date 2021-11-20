import { Actor } from "../actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../events"
import * as _ from 'lodash'
import { getRandomInt } from "../../util/math"
import { BasicAttackEvent } from "./basicAttack"

class TargetFinalizedEvent extends CombatEvent {
    constructor(attackerPartyIndex: number, attackerIndex: number, defenderPartyIndex: number, defenderIndex: number) {
        super(EventKind.TARGET_FINALIZED, attackerPartyIndex, attackerIndex, defenderPartyIndex, defenderIndex)
    }

    processTargetFinalized(parties: Actor[][]): ProcessedEventResult {
        let newPartyStates = _.cloneDeep(parties)
        
        let newEvents: Event[] = [new BasicAttackEvent(this)]

        let attacker = newPartyStates[this.attackerPartyIndex][this.attackerIndex]

        // does this have the same problem as startAttack? selects dead targets?
        // you poison the thing you attack, so it has to be alive
        // but how could it die between now and the item being used when the item is thorns?
        // i think we have an old reference to the parties array somehow

        for (let i = 0; i < attacker.items.length; i++) {
            const itemOnTargetFinalizedResult = attacker.items[i].handleOnTargetFinalized(newPartyStates, this)
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