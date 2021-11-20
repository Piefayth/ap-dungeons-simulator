import { Actor } from "../engine/actor"
import { AuraKind } from "../engine/aura"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import * as _ from 'lodash'
import { HealingReceivedEvent } from "../engine/events/healingReceived"
import { DamageDealtEvent } from "../engine/events/damageDealt"
import { combatMessage } from "../log"
import { getRandomLivingActor } from "../util/actor"

export class MartyrArmor extends Item {
    constructor(tier: number) {
        let kind = ItemKind.MARTYR_ARMOR
        let name = ItemKind[ItemKind.MARTYR_ARMOR]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnDamageDealt(parties: Actor[][], triggeredBy: DamageDealtEvent): ProcessedEventResult {
        let newPartyStates = _.cloneDeep(parties)
        let defender = newPartyStates[triggeredBy.targetPartyIndex][triggeredBy.targetIndex]
        const newEvents: Event[] = []

        const roll = getRandomInt(0, 100)
        if (roll > 66) {
            return {
                newPartyStates,
                newEvents
            }
        }

        const possibleTargets = newPartyStates[triggeredBy.targetPartyIndex]
            .filter((actor, i) => !actor.isSummoned && !actor.dead && i != triggeredBy.targetIndex)

        if (possibleTargets.length == 0) {
            return {
                newPartyStates,
                newEvents
            }
        }

        let targetIndex = getRandomLivingActor(
            newPartyStates, triggeredBy.targetPartyIndex, (actor, i) => !actor.isSummoned && !actor.dead && i != triggeredBy.targetIndex
        )
        const target = newPartyStates[triggeredBy.targetPartyIndex][targetIndex]

        const healingReceived = 2 * this.tier
        const energyReceived = 1 * this.tier

        const armorHealingEvent = new HealingReceivedEvent(healingReceived, triggeredBy.targetPartyIndex, targetIndex, triggeredBy)
        newEvents.push(armorHealingEvent)
        target.energy += energyReceived

        newPartyStates[triggeredBy.targetPartyIndex][targetIndex] = target

        combatMessage(`${defender.name}'s sacrifice invigorates ${target.name}. They gain ${healingReceived} HP and ${energyReceived} energy.`)

        return {
            newPartyStates,
            newEvents
        }
    }
}