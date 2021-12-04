import { Actor } from "../engine/actor"
import { AuraKind } from "../engine/aura"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { DamageDealtEvent } from "../engine/events/damageDealt"
import { SelectTargetEvent } from "../engine/events/selectTarget"
import { TargetFinalizedEvent } from "../engine/events/targetFinalized"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { DungeonContext } from '../simulator'
import { getRandomInt } from "../util/math"

export class SeekingMissiles extends Item {
    constructor(tier: number) {
        let kind = ItemKind.SEEKING_MISSILES
        let name = ItemKind[ItemKind.SEEKING_MISSILES]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    // needs a "handle before turn" that applies the intial seeking missiles aura
    // then target finalized finds the existing aura and sets the stacks
    // seeking missiles also needs to pick its target at this time, and we can pass that down in the aura someway

    handleBeforeAttackerTargetFinalized(ctx: DungeonContext, parties: Actor[][], triggeredBy: SelectTargetEvent): SelectTargetEvent {
        let lowestHP = parties[triggeredBy.defenderPartyIndex][triggeredBy.defenderIndex].curHP
        let newTargetIndex = triggeredBy.defenderIndex

        for (let i = 0; i < parties[triggeredBy.defenderPartyIndex].length; i++) {
            if (parties[triggeredBy.defenderPartyIndex][i].curHP > 0 && parties[triggeredBy.defenderPartyIndex][i].curHP < lowestHP) {
                lowestHP = parties[triggeredBy.defenderPartyIndex][i].curHP
                newTargetIndex = i
            }
        }

        // this function is responsible for reassigning the basic attack target
        // and printing the message
        // death checking should happen right before this

        ctx.logCombatMessage(`${
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

    handleOnTargetFinalized(ctx: DungeonContext, parties: Actor[][], triggeredBy: TargetFinalizedEvent): ProcessedEventResult {
        let attacker = parties[triggeredBy.attackerPartyIndex][triggeredBy.attackerIndex]
        let defender = parties[triggeredBy.defenderPartyIndex][triggeredBy.defenderIndex]

        // Seeking missiles actually does 0.5 damage per tier per 10% hp missing
        // The double rounding here might not be 100% correct?
        // TODO: Test if this works better without operating on "chunks" of missing HP

        let hpPercentageMissing = 100 - (100 * (defender.curHP / defender.maxHP))
        let missilesMultiplier = Math.floor(hpPercentageMissing / 10)
        let missileDamage = Math.floor(0.5 * this.tier * missilesMultiplier)

        attacker.auras.push({
            kind: AuraKind.SEEKING_MISSILES,
            stacks: missileDamage
        })

        parties[triggeredBy.attackerPartyIndex][triggeredBy.attackerIndex] = attacker

        ctx.logCombatMessage(`Seeking Missiles deal an extra ${missileDamage} damage.`)

        return {
            newPartyStates: parties,
            newEvents: []
        }
    }
}