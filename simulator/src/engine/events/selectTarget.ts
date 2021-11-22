import { Actor } from "../actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../events"
import cloneDeep from 'lodash/cloneDeep'
import { getRandomInt } from "../../util/math"
import { TargetFinalizedEvent } from "./targetFinalized"
import { forAllLivingActors, getRandomLivingActor } from "../../util/actor"
import { DungeonContext } from "../../simulator"

class SelectTargetEvent extends Event {
    attackerPartyIndex: number
    attackerIndex: number
    defenderPartyIndex: number
    defenderIndex?: number

    constructor(attackerPartyIndex: number, attackerIndex: number, defenderIndex?: number) {
        super(EventKind.SELECT_TARGET)
        this.attackerPartyIndex = attackerPartyIndex
        this.defenderPartyIndex = attackerPartyIndex === 0 ? 1 : 0
        this.attackerIndex = attackerIndex
        this.defenderIndex = defenderIndex
    }

    processSelectTarget(ctx: DungeonContext, parties: Actor[][]): ProcessedEventResult {
        let newPartyStates = cloneDeep(parties)
        let attacker = newPartyStates[this.attackerPartyIndex][this.attackerIndex]
        if (this.defenderIndex === undefined) {
            this.defenderIndex = getRandomLivingActor(newPartyStates, this.defenderPartyIndex)
        }

        for (let i = 0; i < attacker.items.length; i++) {
            const newSelectTargetEvent = attacker.items[i].handleBeforeAttackerTargetFinalized(ctx, newPartyStates, this)
            if (newSelectTargetEvent) {
                this.defenderIndex = newSelectTargetEvent.defenderIndex
            }
        }

        newPartyStates = forAllLivingActors(newPartyStates, this.defenderPartyIndex, (iteratedDefender, i) => {
            for (let j = 0; j < iteratedDefender.items.length; j++) {
                const newSelectTargetEvent = iteratedDefender.items[j].handleBeforeDefenderTargetFinalized(ctx, newPartyStates, i, this)
                if (newSelectTargetEvent) {
                    // if a party member jumps in front of an attack, they can't do it again for the same attack
                    if (newSelectTargetEvent.defenderIndex != this.defenderIndex) {
                        this.defenderIndex = newSelectTargetEvent.defenderIndex
                        break
                    } else if (newSelectTargetEvent != null) {
                        break
                    }
                }
            }

            return iteratedDefender
        })

        let newEvents = [new TargetFinalizedEvent(this.attackerPartyIndex, this.attackerIndex, this.defenderPartyIndex, this.defenderIndex)]

        return {
            newPartyStates,
            newEvents
        }
    }
}

export {
    SelectTargetEvent
}