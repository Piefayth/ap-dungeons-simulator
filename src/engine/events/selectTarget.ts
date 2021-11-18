import { Actor } from "../actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../events"
import * as _ from 'lodash'
import { getRandomInt } from "../../util/math"
import { TargetFinalizedEvent } from "./targetFinalized"

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

    processSelectTarget(parties: Actor[][]): ProcessedEventResult {
        let newPartyStates = _.cloneDeep(parties)
        let attacker = newPartyStates[this.attackerPartyIndex][this.attackerIndex]
        if (this.defenderIndex === undefined) {
            this.defenderIndex = getRandomInt(0, newPartyStates[this.defenderPartyIndex].length)
        }

        for (let i = 0; i < attacker.items.length; i++) {
            const newSelectTargetEvent = attacker.items[i].handleBeforeAttackerTargetFinalized(newPartyStates, this)
            if (newSelectTargetEvent) {
                this.defenderIndex = newSelectTargetEvent.defenderIndex
            }
        }

        for (let i = 0; i < newPartyStates[this.defenderPartyIndex].length; i++) {
            let iteratedDefender = newPartyStates[this.defenderPartyIndex][i]
            for (let j = 0; j < iteratedDefender.items.length; j++) {
                const newSelectTargetEvent = iteratedDefender.items[j].handleBeforeDefenderTargetFinalized(newPartyStates, i, this)
                if (newSelectTargetEvent) {
                    this.defenderIndex = newSelectTargetEvent.defenderIndex
                }
            }
        }

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