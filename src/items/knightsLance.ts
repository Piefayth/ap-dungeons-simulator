import { Actor } from "../engine/actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { DamageDealtEvent } from "../engine/events/damageDealt"
import { StartTurnEvent } from "../engine/events/startTurn"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import * as _ from 'lodash'
import { HealingReceivedEvent } from "../engine/events/healingReceived"
import { combatMessage } from "../log"

export class KnightsLance extends Item {
    constructor(tier: number) {
        let kind = ItemKind.KNIGHTS_LANCE
        let name = ItemKind[ItemKind.KNIGHTS_LANCE]
        let energyCost = 40
        super(kind, name, tier, energyCost)
    }

    handleOnTurnStart(parties: Actor[][], event: StartTurnEvent): ProcessedEventResult {
        let newPartyStates = _.cloneDeep(parties)
        let attacker = newPartyStates[event.turnActorPartyIndex][event.turnActorIndex]

        if (attacker.energy < this.energyCost) {
            return {
                newPartyStates: parties,
                newEvents: []
            }
        }

        const defenderPartyIndex = event.turnActorPartyIndex === 0 ? 1 : 0
        let lanceEvents: Event[] = []

        const lanceDamageMin = 5 * this.tier
        const lanceDamageMax = 10 * this.tier
        let lanceDamage = getRandomInt(lanceDamageMin, lanceDamageMax + 1)
        const lanceTarget = getRandomInt(0, newPartyStates[defenderPartyIndex].length)
        const triggeringEvent = new CombatEvent(
            EventKind.GENERIC_COMBAT,
            event.turnActorPartyIndex,
            event.turnActorIndex,
            defenderPartyIndex,
            lanceTarget
        )

        let defender = newPartyStates[defenderPartyIndex][lanceTarget]

        if (attacker.curHP === attacker.maxHP) {
            lanceDamage *= 2
            const damageDealtEvent = new DamageDealtEvent(lanceDamage, defenderPartyIndex, lanceTarget, triggeringEvent)
            lanceEvents.push(damageDealtEvent)
            combatMessage(`${attacker.name} pierces ${defender.name} with a knight's lance. ${defender.name} takes ${lanceDamage} dmg.`)
        } else {
            const damageDealtEvent = new DamageDealtEvent(lanceDamage, defenderPartyIndex, lanceTarget, triggeringEvent)
            const healingReceivedEvent = new HealingReceivedEvent(lanceDamage, event.turnActorPartyIndex, event.turnActorIndex, triggeringEvent)
            lanceEvents.push(damageDealtEvent)
            lanceEvents.push(healingReceivedEvent)
            combatMessage(`${attacker.name} pierces ${defender.name} with a knight's lance. ${defender.name} takes ${lanceDamage} dmg. When did ${attacker.name} become a knight? Who knows, but ${attacker.name} heals ${lanceDamage} hp.` )
        }

        attacker.energy -= this.energyCost
        newPartyStates[event.turnActorPartyIndex][event.turnActorIndex] = attacker

        return {
            newPartyStates: newPartyStates,
            newEvents: lanceEvents
        }
    }
}