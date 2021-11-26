import { Actor } from "../actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../events"
import { getRandomInt } from "../../util/math"
import { BasicAttackEvent } from "./basicAttack"
import { AuraKind } from "../aura"
import cloneDeep from 'lodash/cloneDeep'
import { DungeonContext } from "../../simulator"
import { DamageTakenEvent } from "./damageTaken"

class EndTurnEvent extends Event {
    turnActorPartyIndex: number
    turnActorIndex: number

    constructor(turnActorPartyIndex: number, turnActorIndex: number) {
        super(EventKind.END_TURN)
        this.turnActorPartyIndex = turnActorPartyIndex
        this.turnActorIndex = turnActorIndex
    }

    processEndTurn(ctx: DungeonContext, parties: Actor[][]): ProcessedEventResult {
        let newPartyStates = cloneDeep(parties)
        let newEvents: Event[] = []

        for (let a = 0; a < newPartyStates[this.turnActorPartyIndex][this.turnActorIndex].auras.length; a++) {
            const aura = newPartyStates[this.turnActorPartyIndex][this.turnActorIndex].auras[a]
            if (aura.kind === AuraKind.POISON) {
                const poisonEvent = new DamageTakenEvent(aura.stacks, this.turnActorPartyIndex, this.turnActorIndex, null)
                
                newEvents.push(poisonEvent)

                ctx.logCombatMessage(`${
                    newPartyStates[this.turnActorPartyIndex][this.turnActorIndex].name
                } is suffering from poison! ${
                    newPartyStates[this.turnActorPartyIndex][this.turnActorIndex].name
                } takes ${aura.stacks} poison damage.`)
            }
        }

        return {
            newPartyStates,
            newEvents
        }
    }
}

export {
    EndTurnEvent
}