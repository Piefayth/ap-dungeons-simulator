import { Actor } from "../engine/actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { DamageDealtEvent } from "../engine/events/damageDealt"
import { StartTurnEvent } from "../engine/events/startTurn"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import { HealingReceivedEvent } from "../engine/events/healingReceived"

import { forAllLivingActors } from "../util/actor"
import { DungeonContext } from "../simulator"

export class FestiveFeast extends Item {
    constructor(tier: number) {
        let kind = ItemKind.FESTIVE_FEAST
        let name = ItemKind[ItemKind.FESTIVE_FEAST]
        let energyCost = 80
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

        let feastEvents: Event[] = []
        const defenderPartyIndex = event.turnActorPartyIndex === 0 ? 1 : 0

        ctx.logCombatMessage(`${attacker.name} conjures a feast and the team enjoys some food. The scraps get thrown at the enemies.`)  // TODO: Use the real combat text

        parties = forAllLivingActors(parties, defenderPartyIndex, (actor, i) => {
            const feastDamage = 3 * this.tier

            const damageDealtEvent = new DamageDealtEvent(feastDamage, defenderPartyIndex, i, event, event.turnActorIndex)
            feastEvents.push(damageDealtEvent)

            ctx.logCombatMessage(`The food hits ${parties[defenderPartyIndex][i].name} in they face. They take ${feastDamage} damage.`)

            return actor
        })

        parties = forAllLivingActors(parties, event.turnActorPartyIndex, (actor, i) => {
            const feastDamage = 3 * this.tier

            const healingReceivedEvent = new HealingReceivedEvent(feastDamage, event.turnActorPartyIndex, i, event)
            feastEvents.push(healingReceivedEvent)

            ctx.logCombatMessage(`${parties[event.turnActorPartyIndex][i].name} heals for ${feastDamage} HP.`)

            return actor
        })

        attacker.energy -= this.energyCost
        parties[event.turnActorPartyIndex][event.turnActorIndex] = attacker

        return {
            newPartyStates: parties,
            newEvents: feastEvents
        }
    }
}