import { Actor } from "../engine/actor"
import { AuraKind } from "../engine/aura"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import cloneDeep from 'lodash/cloneDeep'
import { HealingReceivedEvent } from "../engine/events/healingReceived"
import { StartTurnEvent } from "../engine/events/startTurn"
import { SelectTargetEvent } from "../engine/events/selectTarget"
import { combatMessage } from "../log"

export class HealingPendant extends Item {
    constructor(tier: number) {
        let kind = ItemKind.HEALING_PENDANT
        let name = ItemKind[ItemKind.HEALING_PENDANT]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnTurnStart(parties: Actor[][], event: StartTurnEvent): ProcessedEventResult {
        let attacker = parties[event.turnActorPartyIndex][event.turnActorIndex]
        const newEvents: Event[] = []

        let roll = getRandomInt(0, 2)
        if (roll > 0) {
            const healingReceived = 5 * this.tier
            const pendantHealingEvent = new HealingReceivedEvent(healingReceived, event.turnActorPartyIndex, event.turnActorIndex, event)
            newEvents.push(pendantHealingEvent)
            combatMessage(`The magic of ${attacker.name}'s healing pendant revitalizes them. ${attacker.name} restores ${healingReceived} HP.`)
        }

        return {
            newPartyStates: parties,
            newEvents
        }
    }

    handleBeforeDefenderTargetFinalized(parties: Actor[][], itemHolderIndex: number, event: SelectTargetEvent): SelectTargetEvent {
        if (itemHolderIndex === event.defenderIndex) {
            return null
        }

        let chance = 10 + this.tier * 3
        let roll = getRandomInt(0, 100)
        if (roll < chance) {
            let attacker = parties[event.attackerPartyIndex][event.attackerIndex]
            let originalDefender = parties[event.defenderPartyIndex][event.defenderIndex]
            let newDefender = parties[event.defenderPartyIndex][itemHolderIndex]

            if (newDefender.curHP < originalDefender.curHP) {
                combatMessage(`${newDefender.name} thinks about jumping in front of the attack, but is a coward.`)

                return new SelectTargetEvent(
                    event.attackerPartyIndex,
                    event.attackerIndex,
                    event.defenderIndex,
                )
            }

            combatMessage(`${attacker.name} targets ${originalDefender.name} but ${
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