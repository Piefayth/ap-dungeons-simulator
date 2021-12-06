import { Actor } from "../engine/actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import { AuraKind } from "../engine/aura"
import { TargetFinalizedEvent } from "../engine/events/targetFinalized"

import { DungeonContext } from "../simulator"

export class PoisonDagger extends Item {
    constructor(tier: number) {
        let kind = ItemKind.POISON_DAGGER
        let name = ItemKind[ItemKind.POISON_DAGGER]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnDungeonStart(ctx: DungeonContext, parties: Actor[][], ownerPartyIndex: number, ownerIndex: number): ProcessedEventResult {
        let owner = parties[ownerPartyIndex][ownerIndex]

        owner.curHP += 3 * this.tier
        owner.maxHP += 3 * this.tier

        parties[ownerPartyIndex][ownerIndex] = owner

        return {
            newPartyStates: parties,
            newEvents: []
        }
    }

    handleOnTargetFinalized(ctx: DungeonContext, parties: Actor[][], triggeredBy: TargetFinalizedEvent): ProcessedEventResult {
        let attacker = parties[triggeredBy.attackerPartyIndex][triggeredBy.attackerIndex]
        let defender = parties[triggeredBy.defenderPartyIndex][triggeredBy.defenderIndex]
        
        let existingPoisonIndex = defender.auras.findIndex(it => it.kind === AuraKind.POISON)
        if (existingPoisonIndex >= 0) {
            defender.auras[existingPoisonIndex].stacks += 1 * this.tier
        } else {
            defender.auras.push({
                kind: AuraKind.POISON,
                stacks: 1 * this.tier
            })
        }

        parties[triggeredBy.defenderPartyIndex][triggeredBy.defenderIndex] = defender

        ctx.logCombatMessage(`${attacker.name}'s poison dagger inflicts a deadly poison on ${defender.name}.`)

        return {
            newPartyStates: parties,
            newEvents: []
        }
    }
}