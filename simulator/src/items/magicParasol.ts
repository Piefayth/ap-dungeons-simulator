import { Actor } from "../engine/actor"
import { AuraKind } from "../engine/aura"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import cloneDeep from 'lodash/cloneDeep'
import { DamageDealtEvent } from "../engine/events/damageDealt"
import { SelectTargetEvent } from "../engine/events/selectTarget"

import { DungeonContext } from "../simulator"
import { CHUMBY_CHICKEN_NAME } from "./chicken"

export class MagicParasol extends Item {
    constructor(tier: number) {
        let kind = ItemKind.MAGIC_PARASOL
        let name = ItemKind[ItemKind.MAGIC_PARASOL]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnDamageDealt(ctx: DungeonContext, parties: Actor[][], triggeredBy: DamageDealtEvent): ProcessedEventResult {
        let newPartyStates = cloneDeep(parties)
        let defender = newPartyStates[triggeredBy.targetPartyIndex][triggeredBy.targetIndex]
        const newEvents: Event[] = []

        const chance = 5 + (5 * this.tier)
        const damageReduction = 5 + (3 * this.tier)
        const roll = getRandomInt(0, 100)
        if (roll < chance) {
            ctx.logCombatMessage(`${defender.name} uses their Magic Parasol to block ${damageReduction} damage.`)
            Math.max(0, triggeredBy.damageDealt -= damageReduction)
        }

        return {
            newPartyStates,
            newEvents
        }
    }

    handleBeforeDefenderTargetFinalized(ctx: DungeonContext, parties: Actor[][], itemHolderIndex: number, event: SelectTargetEvent): SelectTargetEvent {
        if (itemHolderIndex === event.defenderIndex) {
            return null
        }

        let chance = 10 + this.tier * 3
        let roll = getRandomInt(0, 100)
        if (roll < chance) {
            let attacker = parties[event.attackerPartyIndex][event.attackerIndex]
            let originalDefender = parties[event.defenderPartyIndex][event.defenderIndex]
            let newDefender = parties[event.defenderPartyIndex][itemHolderIndex]

            if (originalDefender.name.includes(CHUMBY_CHICKEN_NAME)) {
                return null
            }

            if (newDefender.curHP < originalDefender.curHP) {
                ctx.logCombatMessage(`${newDefender.name} thinks about jumping in front of the attack, but is a coward.`)

                return new SelectTargetEvent(
                    event.attackerPartyIndex,
                    event.attackerIndex,
                    event.defenderIndex,
                )
            }

            ctx.logCombatMessage(`${attacker.name} targets ${originalDefender.name} but ${
                newDefender.name} jumps in front of the attack and saves them.`)

            return new SelectTargetEvent(
                event.attackerPartyIndex,
                event.attackerIndex,
                itemHolderIndex,
            )
        }

        return null
    }
}