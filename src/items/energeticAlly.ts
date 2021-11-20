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

export class EnergeticAlly extends Item {
    constructor(tier: number) {
        let kind = ItemKind.ENERGETIC_ALLY
        let name = ItemKind[ItemKind.ENERGETIC_ALLY]
        let energyCost = 50
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

        const allyHealing = 5 + (5 * this.tier)
        const allyEnergy = 20
        
        let allyTarget = -1
        let lowestHP = Infinity

        for (let i = 0; i < newPartyStates[event.turnActorPartyIndex].length; i++) {
            if (newPartyStates[event.turnActorPartyIndex][i].curHP < lowestHP) {
                lowestHP = newPartyStates[event.turnActorPartyIndex][i].curHP
                allyTarget = i
            }
        }

        let allyEvents: Event[] = []
        const allyHealingEvent = new HealingReceivedEvent(allyHealing, event.turnActorPartyIndex, allyTarget, event)
        allyEvents.push(allyHealingEvent)

        attacker.energy -= this.energyCost
        newPartyStates[event.turnActorPartyIndex][allyTarget].energy += allyEnergy
        newPartyStates[event.turnActorPartyIndex][event.turnActorIndex] = attacker

        combatMessage(`${attacker.name}'s cat blinds ${
            newPartyStates[event.turnActorPartyIndex][allyTarget].name
        } with an invigorating ray. ${
            newPartyStates[event.turnActorPartyIndex][allyTarget].name
        } recovers ${allyHealing} hp and gains ${allyEnergy} energy.`)

        return {
            newPartyStates: newPartyStates,
            newEvents: allyEvents
        }
    }
}