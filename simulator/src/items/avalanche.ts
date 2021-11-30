import { Actor } from "../engine/actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { DamageDealtEvent } from "../engine/events/damageDealt"
import { StartTurnEvent } from "../engine/events/startTurn"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"

import { getRandomLivingActor } from "../util/actor"
import { DungeonContext } from "../simulator"

export class Avalanche extends Item {
    constructor(tier: number) {
        let kind = ItemKind.AVALANCHE
        let name = ItemKind[ItemKind.AVALANCHE]
        let energyCost = 40
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

        const defenderPartyIndex = event.turnActorPartyIndex === 0 ? 1 : 0
        let avalancheEvents: Event[] = []
        
        ctx.logCombatMessage(`${attacker.name} creates a massive avalanche.`)

        // HACK: This preemptively checks for deaths to avoid invalid double-targeting 
        // This should probably just trigger two AVALANCHE_TARGET events or something
        // But trying to avoid item-specific events for now
        // Edit: This might be wrong per Zethorix's spreadsheet, double targeting could be valid. >:(

        let ignoredDefenders: number[] = []
        for (let i = 0; i < 2; i++) {
            if (parties[defenderPartyIndex].length - ignoredDefenders.length <= 0) {
                continue
            }

            let possibleAvalancheTarget = getRandomLivingActor(
                parties, defenderPartyIndex, (_, index) => true // !ignoredDefenders.includes(index) - if the avalanche bug gets fixed, uncomment
            )

            if (possibleAvalancheTarget === -1) {
                continue
            }
            
            let avalancheMinDamage = 3 * this.tier
            let avalancheMaxDamage = 5 * this.tier
            let avalancheDamage = getRandomInt(avalancheMinDamage, avalancheMaxDamage + 1)
            let avalancheMinSpeed = 0
            let avalancheMaxSpeed = 1 * this.tier

            let avalancheSpeedReduction = getRandomInt(avalancheMinSpeed, avalancheMaxSpeed + 1)

            const damageDealtEvent = new DamageDealtEvent(avalancheDamage, defenderPartyIndex, possibleAvalancheTarget, event, event.turnActorIndex)

            avalancheEvents.unshift(damageDealtEvent)

            let defender = parties[defenderPartyIndex][possibleAvalancheTarget]
            defender.speed = Math.max(1, defender.speed - avalancheSpeedReduction)
            parties[defenderPartyIndex][possibleAvalancheTarget] = defender

            if ((defender.curHP - avalancheDamage) <= 0) {
                ignoredDefenders.push(possibleAvalancheTarget)
            } 

            const displayString = `${
                parties[defenderPartyIndex][possibleAvalancheTarget].name
            } takes ${avalancheDamage} damage${avalancheSpeedReduction ? ", losing " + avalancheSpeedReduction + " speed!" : "!"}`
            ctx.logCombatMessage(displayString)
        }

        attacker.energy -= this.energyCost
        parties[event.turnActorPartyIndex][event.turnActorIndex] = attacker

        return {
            newPartyStates: parties,
            newEvents: avalancheEvents
        }
    }
}