import { Actor } from "../engine/actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { DamageDealtEvent } from "../engine/events/damageDealt"
import { StartTurnEvent } from "../engine/events/startTurn"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import cloneDeep from 'lodash/cloneDeep'
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
        let newPartyStates = cloneDeep(parties)
        let attacker = newPartyStates[event.turnActorPartyIndex][event.turnActorIndex]

        if (attacker.energy < this.energyCost) {
            return {
                newPartyStates: parties,
                newEvents: []
            }
        }

        let feastEvents: Event[] = []
        const defenderPartyIndex = event.turnActorPartyIndex === 0 ? 1 : 0

        ctx.logCombatMessage(`${attacker.name} prepares a festive feast!`)  // TODO: Use the real combat text

        newPartyStates = forAllLivingActors(newPartyStates, defenderPartyIndex, (actor, i) => {
            const feastDamage = 3 * this.tier

            const damageDealtEvent = new DamageDealtEvent(feastDamage, defenderPartyIndex, i, event, event.turnActorIndex)
            feastEvents.push(damageDealtEvent)

            ctx.logCombatMessage(`${newPartyStates[defenderPartyIndex][i].name} eats the feast and loses ${feastDamage} HP.`)

            return actor
        })

        newPartyStates = forAllLivingActors(newPartyStates, event.turnActorPartyIndex, (actor, i) => {
            const feastDamage = 3 * this.tier

            const healingReceivedEvent = new HealingReceivedEvent(feastDamage, event.turnActorPartyIndex, i, event)
            feastEvents.push(healingReceivedEvent)

            ctx.logCombatMessage(`${newPartyStates[event.turnActorPartyIndex][i].name} eats the feast and gains ${feastDamage} HP.`)

            return actor
        })

        attacker.energy -= this.energyCost
        newPartyStates[event.turnActorPartyIndex][event.turnActorIndex] = attacker

        return {
            newPartyStates: newPartyStates,
            newEvents: feastEvents
        }
    }
}