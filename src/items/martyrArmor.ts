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

export class MartyrArmor extends Item {
    constructor(tier: number) {
        let kind = ItemKind.MARTYR_ARMOR
        let name = ItemKind[ItemKind.MARTYR_ARMOR]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnDamageDealt(parties: Actor[][], triggeredBy: DamageDealtEvent): ProcessedEventResult {
        let newPartyStates = _.cloneDeep(parties)
        let defender = newPartyStates[triggeredBy.defenderPartyIndex][triggeredBy.defenderIndex]
        const newEvents: Event[] = []

        const roll = getRandomInt(0, 100)
        if (roll > 66) {
            return {
                newPartyStates,
                newEvents
            }
        }

        const possibleTargets = newPartyStates[triggeredBy.defenderPartyIndex]
            .filter(it => !it.isSummoned && it.name != defender.name)

        if (possibleTargets.length == 0) {
            return {
                newPartyStates,
                newEvents
            }
        }

        const possibleTargetIndex = getRandomInt(0, possibleTargets.length)
        const target = possibleTargets[possibleTargetIndex]
        let targetIndex = newPartyStates[triggeredBy.defenderPartyIndex].indexOf(target)

        // HACK: 
        // if the taken damage is lethal, the target index will reduce by 1 if the target comes after the item holder

        if (defender.curHP - triggeredBy.damageDealt <= 0) {
            if (triggeredBy.defenderIndex < targetIndex) {
                targetIndex -= 1
            }
        }

        const healingReceived = 2 * this.tier
        const energyReceived = 1 * this.tier

        const armorHealingEvent = new HealingReceivedEvent(healingReceived, triggeredBy.defenderPartyIndex, targetIndex, triggeredBy)
        newEvents.push(armorHealingEvent)
        target.energy += energyReceived

        newPartyStates[triggeredBy.defenderPartyIndex][targetIndex] = target

        combatMessage(`${defender.name}'s sacrifice invigorates ${target.name}. They gain ${healingReceived} HP and ${energyReceived} energy.`)

        return {
            newPartyStates,
            newEvents
        }
    }
}