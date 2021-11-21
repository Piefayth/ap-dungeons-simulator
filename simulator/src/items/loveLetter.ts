import { Actor } from "../engine/actor"
import { AuraKind } from "../engine/aura"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import * as _ from 'lodash'
import { HealingReceivedEvent } from "../engine/events/healingReceived"
import { combatMessage } from "../log"
import { getRandomLivingActor } from "../util/actor"

export class LoveLetter extends Item {
    constructor(tier: number) {
        let kind = ItemKind.LOVE_LETTER
        let name = ItemKind[ItemKind.LOVE_LETTER]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnAfterAttack(parties: Actor[][], triggeredBy: CombatEvent): ProcessedEventResult {
        let newPartyStates = _.cloneDeep(parties)
        let attacker = newPartyStates[triggeredBy.attackerPartyIndex][triggeredBy.attackerIndex]
        const newEvents: Event[] = []

        const possibleTargets = newPartyStates[triggeredBy.attackerPartyIndex]
            .filter((actor, i) => !actor.isSummoned && !actor.dead && i != triggeredBy.attackerIndex)

        if (possibleTargets.length == 0) {
            return {
                newPartyStates,
                newEvents
            }
        }

        const targetIndex = getRandomLivingActor(
            newPartyStates, triggeredBy.attackerPartyIndex, (actor, i) => !actor.isSummoned && !actor.dead && i != triggeredBy.attackerIndex
        )
        const target = newPartyStates[triggeredBy.attackerPartyIndex][targetIndex]

        const healingReceived = 2 * this.tier
        const energyReceived = 1 * this.tier
        
        const letterHealingEvent = new HealingReceivedEvent(healingReceived, triggeredBy.attackerPartyIndex, targetIndex, triggeredBy)
        newEvents.push(letterHealingEvent)
        target.energy += energyReceived

        newPartyStates[triggeredBy.attackerPartyIndex][targetIndex] = target

        combatMessage(`${attacker.name} gives ${target.name} a letter showing their love! ${target.name} gains ${healingReceived} hp and ${energyReceived} energy.`)

        return {
            newPartyStates,
            newEvents
        }
    }
}