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

    handleOnAfterAttack(ctx: DungeonContext, parties: Actor[][], event: CombatEvent): ProcessedEventResult {
        let attacker = parties[event.attackerPartyIndex][event.attackerIndex]

        if (attacker.energy < this.energyCost) {
            return {
                newPartyStates: parties,
                newEvents: []
            }
        }
        
        const allyHealing = 5 * this.tier
        const allyEnergy = 20
        
        let allyTarget = event.attackerIndex
        let lowestHP = attacker.curHP

        for (let i = 0; i < parties[event.attackerPartyIndex].length; i++) {
            if (parties[event.attackerPartyIndex][i].isSummoned) continue

            if (
                parties[event.attackerPartyIndex][i].curHP > 0 && 
                parties[event.attackerPartyIndex][i].curHP < lowestHP &&
                parties[event.attackerPartyIndex][i].curHP < parties[event.attackerPartyIndex][i].maxHP
            ) {
                lowestHP = parties[event.attackerPartyIndex][i].curHP
                allyTarget = i
            }
        }

        let allyEvents: Event[] = []

        const allyHealingEvent = new HealingReceivedEvent(allyHealing, event.attackerPartyIndex, allyTarget)
        allyEvents.push(allyHealingEvent)

        attacker.energy -= this.energyCost
        parties[event.attackerPartyIndex][allyTarget].energy += allyEnergy
        parties[event.attackerPartyIndex][event.attackerIndex] = attacker
        
        ctx.logCombatMessage(`${attacker.name}'s cat blinds ${
            parties[event.attackerPartyIndex][allyTarget].name
        } with an invigorating ray. ${
            parties[event.attackerPartyIndex][allyTarget].name
        } recovers ${allyHealing} hp and gains ${allyEnergy} energy.`)

        return {
            newPartyStates: parties,
            newEvents: allyEvents
        }
    }
}