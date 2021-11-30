import { Actor } from "../engine/actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"

import { DungeonContext } from "../simulator"

export class DrainingDagger extends Item {
    constructor(tier: number) {
        let kind = ItemKind.DRAINING_DAGGER
        let name = ItemKind[ItemKind.DRAINING_DAGGER]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnTargetFinalized(ctx: DungeonContext, parties: Actor[][], triggeredBy: CombatEvent): ProcessedEventResult {
        let attacker = parties[triggeredBy.attackerPartyIndex][triggeredBy.attackerIndex]
        let defender = parties[triggeredBy.defenderPartyIndex][triggeredBy.defenderIndex]
        
        let potentialAttackDrained = 1 * this.tier
        let actualAttackDrained = Math.min(defender.attackMin, potentialAttackDrained)
        defender.attackMin -= actualAttackDrained
        defender.attackMax -= actualAttackDrained

        ctx.logCombatMessage(`${attacker.name}'s draining dagger drains ${defender.name}. ${defender.name} loses ${actualAttackDrained} attack.`)

        let chance = 20
        let energyDrained = 1 * this.tier
        let roll = getRandomInt(0, 100)
        if (roll < chance) {
            defender.energy = Math.max(0, defender.energy - 1)
            ctx.logCombatMessage(`Draining dagger saps ${defender.name}'s energy.`)
        }


        parties[triggeredBy.attackerPartyIndex][triggeredBy.attackerIndex] = attacker
        parties[triggeredBy.defenderPartyIndex][triggeredBy.defenderIndex] = defender

        return {
            newPartyStates: parties,
            newEvents: []
        }
    }
}