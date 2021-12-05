import { Actor } from "../engine/actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { StartTurnEvent } from "../engine/events/startTurn"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import { HealingReceivedEvent } from "../engine/events/healingReceived"

import { getRandomLivingActor } from "../util/actor"
import { DungeonContext } from "../simulator"

export class BoostingBugle extends Item {
    constructor(tier: number) {
        let kind = ItemKind.BOOSTING_BUGLE
        let name = ItemKind[ItemKind.BOOSTING_BUGLE]
        let energyCost = 55
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

        attacker.energy -= this.energyCost
        parties[event.turnActorPartyIndex][event.turnActorIndex] = attacker

        ctx.logCombatMessage(`${attacker.name} plays an encouraging fanfare!`)

        const possibleTargets = parties[event.turnActorPartyIndex]
            .filter((actor, i) => !actor.isSummoned && !actor.dead && i != event.turnActorIndex)

        if (possibleTargets.length == 0) {
            return {
                newPartyStates: parties,
                newEvents: []
            }
        }

        let bugleEvents: Event[] = []

        for (let i = 0; i < 2; i++) {
            const targetIndex = getRandomLivingActor(
                parties, event.turnActorPartyIndex, (actor, i) => !actor.isSummoned && !actor.dead && i != event.turnActorIndex
            )
            const target = parties[event.turnActorPartyIndex][targetIndex]
    
            const healingReceived = 2 * this.tier
            const attackReceived = 1 * this.tier

            const bugleHealingEvent = new HealingReceivedEvent(healingReceived, event.turnActorPartyIndex, targetIndex)
            bugleEvents.push(bugleHealingEvent)

            target.attackMin += attackReceived
            target.attackMax += attackReceived

            parties[event.turnActorPartyIndex][targetIndex] = target

            ctx.logCombatMessage(`${target.name} gains ${healingReceived} HP and ${attackReceived} attack.`)
        }

        return {
            newPartyStates: parties,
            newEvents: bugleEvents
        }
    }
}