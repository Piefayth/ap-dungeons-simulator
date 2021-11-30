import { Actor } from "../engine/actor"
import { AuraKind } from "../engine/aura"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import { HealingReceivedEvent } from "../engine/events/healingReceived"
import { DamageDealtEvent } from "../engine/events/damageDealt"
import { DamageTakenEvent } from "../engine/events/damageTaken"
import { getRandomLivingActor } from "../util/actor"
import { DungeonContext } from "../simulator"

export class RoughSkin extends Item {
    constructor(tier: number) {
        let kind = ItemKind.ROUGH_SKIN
        let name = ItemKind[ItemKind.ROUGH_SKIN]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnDamageDealt(ctx: DungeonContext, parties: Actor[][], triggeredBy: DamageDealtEvent): ProcessedEventResult {
        let attackerPartyIndex = triggeredBy.targetPartyIndex === 0 ? 1 : 0
        let defender = parties[triggeredBy.targetPartyIndex][triggeredBy.targetIndex]
        let attacker = parties[attackerPartyIndex][triggeredBy.attackerIndex]

        const newEvents: Event[] = []

        const roll = getRandomInt(0, 2)
        if (roll > 0) {
            return {
                newPartyStates: parties,
                newEvents
            }
        }

        const roughDamage = this.tier * 2
        triggeredBy.damageDealt = Math.max(0, triggeredBy.damageDealt - roughDamage)
        newEvents.push(new DamageTakenEvent(roughDamage, attackerPartyIndex, triggeredBy.attackerIndex, triggeredBy))

        ctx.logCombatMessage(`${defender.name}'s unusually rough skin reduces the damage taken by ${
            roughDamage
        }. It's so rough that ${attacker.name} takes ${roughDamage} damage.`)

        return {
            newPartyStates: parties,
            newEvents
        }
    }
}