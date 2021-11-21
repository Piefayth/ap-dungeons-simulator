import { Actor } from "../engine/actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import cloneDeep from 'lodash/cloneDeep'
import { AuraKind } from "../engine/aura"
import { TargetFinalizedEvent } from "../engine/events/targetFinalized"
import { combatMessage } from "../log"

export class PoisonDagger extends Item {
    constructor(tier: number) {
        let kind = ItemKind.POISON_DAGGER
        let name = ItemKind[ItemKind.POISON_DAGGER]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnTargetFinalized(parties: Actor[][], triggeredBy: TargetFinalizedEvent): ProcessedEventResult {
        let newPartyStates = cloneDeep(parties)
        let attacker = newPartyStates[triggeredBy.attackerPartyIndex][triggeredBy.attackerIndex]
        let defender = newPartyStates[triggeredBy.defenderPartyIndex][triggeredBy.defenderIndex]
        
        let existingPoisonIndex = defender.auras.findIndex(it => it.kind === AuraKind.POISON)
        if (existingPoisonIndex >= 0) {
            defender.auras[existingPoisonIndex].stacks += 1 * this.tier
        } else {
            defender.auras.push({
                kind: AuraKind.POISON,
                stacks: 1 * this.tier
            })
        }

        newPartyStates[triggeredBy.defenderPartyIndex][triggeredBy.defenderIndex] = defender

        combatMessage(`${attacker.name}'s poison dagger inflicts a deadly poison on ${defender.name}.`)

        return {
            newPartyStates,
            newEvents: []
        }
    }
}