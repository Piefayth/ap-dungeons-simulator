import { Actor } from "../actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../events"
import { getRandomInt } from "../../util/math"
import { BasicAttackEvent } from "./basicAttack"
import { AuraKind } from "../aura"
import cloneDeep from 'lodash/cloneDeep'
import { DungeonContext } from "../../simulator"

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

                // deal poison damage directly, it cannot be reacted to in a damage dealt event
                newPartyStates[this.turnActorPartyIndex][this.turnActorIndex].curHP = 
                    Math.max(0, newPartyStates[this.turnActorPartyIndex][this.turnActorIndex].curHP - aura.stacks)

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