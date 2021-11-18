import * as _ from 'lodash'
import { Actor } from "../engine/actor"
import { AuraKind } from "../engine/aura"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { DamageTakenEvent } from "../engine/events/damageTaken"
import { SelectTargetEvent } from "../engine/events/selectTarget"
import { TargetFinalizedEvent } from "../engine/events/targetFinalized"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"

export class SeekingMissiles extends Item {
    constructor(tier: number) {
        let kind = ItemKind.SEEKING_MISSILES
        let name = ItemKind[ItemKind.SEEKING_MISSILES]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleBeforeAttackerTargetFinalized(parties: Actor[][], triggeredBy: SelectTargetEvent): SelectTargetEvent {
        let lowestHP = parties[triggeredBy.defenderPartyIndex][triggeredBy.defenderIndex].curHP
        let newTargetIndex = triggeredBy.defenderIndex

        for (let i = 0; i < parties[triggeredBy.defenderPartyIndex].length; i++) {
            if (parties[triggeredBy.defenderPartyIndex][i].curHP < lowestHP) {
                newTargetIndex = i
            }
        }

        console.log(`${
            parties[triggeredBy.attackerPartyIndex][triggeredBy.attackerIndex].name
        } follows their seeking missiles and hunts down ${
            parties[triggeredBy.defenderPartyIndex][newTargetIndex].name
        }.`)

        return new SelectTargetEvent(
            triggeredBy.attackerPartyIndex,
            triggeredBy.attackerIndex,
            newTargetIndex,
        )
    }

    handleOnTargetFinalized(parties: Actor[][], triggeredBy: TargetFinalizedEvent): ProcessedEventResult {
        let newPartyStates = _.cloneDeep(parties)

        let attacker = newPartyStates[triggeredBy.attackerPartyIndex][triggeredBy.attackerIndex]
        let defender = newPartyStates[triggeredBy.defenderPartyIndex][triggeredBy.defenderIndex]

        let hpPercentageMissing = 100 - (100 * (defender.curHP / defender.maxHP))
        let missilesMultiplier = Math.floor(hpPercentageMissing / 20)
        let missileDamage = 1 * this.tier * missilesMultiplier

        attacker.auras.push({
            kind: AuraKind.SEEKING_MISSILES,
            stacks: missileDamage
        })

        newPartyStates[triggeredBy.attackerPartyIndex][triggeredBy.attackerIndex] = attacker

        console.log(`Seeking Missiles deal an extra ${missileDamage} damage.`)

        return {
            newPartyStates,
            newEvents: []
        }
    }
}