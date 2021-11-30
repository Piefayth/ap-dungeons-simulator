import { Actor } from "../engine/actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { DamageDealtEvent } from "../engine/events/damageDealt"
import { StartTurnEvent } from "../engine/events/startTurn"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"

import { forAllLivingActors } from "../util/actor"
import { DungeonContext } from "../simulator"

export class Thorns extends Item {
    constructor(tier: number) {
        let kind = ItemKind.THORNS
        let name = ItemKind[ItemKind.THORNS]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnTurnStart(ctx: DungeonContext, parties: Actor[][], event: StartTurnEvent): ProcessedEventResult {
        const defenderPartyIndex = event.turnActorPartyIndex === 0 ? 1 : 0
        let thornsEvents: Event[] = []
        
        const attacker = parties[event.turnActorPartyIndex][event.turnActorIndex]
        const thornsDamage = 1 * this.tier

        ctx.logCombatMessage(`${attacker.name} unleashes a bunch of wild thorns!`)

        let energyGained = 0
        
        parties = forAllLivingActors(parties, defenderPartyIndex, (defender, i) => {
            const damageDealtEvent = new DamageDealtEvent(thornsDamage, defenderPartyIndex, i, event, event.turnActorIndex)

            thornsEvents = thornsEvents.concat(damageDealtEvent)

            ctx.logCombatMessage(`Ouch! ${defender.name} takes ${thornsDamage} damage from ${attacker.name}'s thorns.`)

            const roll = getRandomInt(0, 100)
            if (roll < 25 && energyGained === 0) {
                energyGained = 1 * this.tier
            }

            return defender
        })

        if (energyGained > 0) {
            attacker.energy += energyGained
            parties[event.turnActorPartyIndex][event.turnActorIndex] = attacker
            
            ctx.logCombatMessage(`${attacker.name}'s thorns gives them ${energyGained} energy.`)
        }
        
        return {
            newPartyStates: parties,
            newEvents: thornsEvents
        }
    }
}