import { Actor } from "../engine/actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { DamageDealtEvent } from "../engine/events/damageDealt"
import { StartTurnEvent } from "../engine/events/startTurn"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import { HealingReceivedEvent } from "../engine/events/healingReceived"

import { DungeonContext } from "../simulator"

export class EnergeticAlly extends Item {
    constructor(tier: number) {
        let kind = ItemKind.ENERGETIC_ALLY
        let name = ItemKind[ItemKind.ENERGETIC_ALLY]
        let energyCost = 50
        super(kind, name, tier, energyCost)
    }

    handleOnTurnStart(ctx: DungeonContext, parties: Actor[][], event: StartTurnEvent): ProcessedEventResult {
        let attacker = parties[event.turnActorPartyIndex][event.turnActorIndex]

        if (attacker.energy < this.energyCost) {
            return {
                newPartyStates: parties,
                newEvents: []
            }
        }

        const allyHealing = 5 * this.tier
        const allyEnergy = 20
        
        let allyTarget = -1
        let lowestHP = Infinity

        for (let i = 0; i < parties[event.turnActorPartyIndex].length; i++) {
            if (
                parties[event.turnActorPartyIndex][i].curHP > 0 && 
                parties[event.turnActorPartyIndex][i].curHP < lowestHP
            ) {
                lowestHP = parties[event.turnActorPartyIndex][i].curHP
                allyTarget = i
            }
        }

        let allyEvents: Event[] = []
        const allyHealingEvent = new HealingReceivedEvent(allyHealing, event.turnActorPartyIndex, allyTarget, event)
        allyEvents.push(allyHealingEvent)

        attacker.energy -= this.energyCost
        parties[event.turnActorPartyIndex][allyTarget].energy += allyEnergy
        parties[event.turnActorPartyIndex][event.turnActorIndex] = attacker

        ctx.logCombatMessage(`${attacker.name}'s cat blinds ${
            parties[event.turnActorPartyIndex][allyTarget].name
        } with an invigorating ray. ${
            parties[event.turnActorPartyIndex][allyTarget].name
        } recovers ${allyHealing} hp and gains ${allyEnergy} energy.`)

        return {
            newPartyStates: parties,
            newEvents: allyEvents
        }
    }
}