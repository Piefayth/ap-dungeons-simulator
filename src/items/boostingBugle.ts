import { Actor } from "../engine/actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { StartTurnEvent } from "../engine/events/startTurn"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import * as _ from 'lodash'
import { HealingReceivedEvent } from "../engine/events/healingReceived"
import { combatMessage } from "../log"
import { getRandomLivingActor } from "../util/actor"

export class BoostingBugle extends Item {
    constructor(tier: number) {
        let kind = ItemKind.BOOSTING_BUGLE
        let name = ItemKind[ItemKind.BOOSTING_BUGLE]
        let energyCost = 55
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

        attacker.energy -= this.energyCost
        newPartyStates[event.turnActorPartyIndex][event.turnActorIndex] = attacker

        combatMessage(`${attacker.name} plays an encouraging fanfare!`)

        const possibleTargets = newPartyStates[event.turnActorPartyIndex]
            .filter((actor, i) => !actor.isSummoned && !actor.dead && i != event.turnActorIndex)

        if (possibleTargets.length == 0) {
            return {
                newPartyStates,
                newEvents: []
            }
        }

        let bugleEvents: Event[] = []

        for (let i = 0; i < 2; i++) {
            const targetIndex = getRandomLivingActor(
                newPartyStates, event.turnActorPartyIndex, (actor, i) => !actor.isSummoned && !actor.dead && i != event.turnActorIndex
            )
            const target = newPartyStates[event.turnActorPartyIndex][targetIndex]
    
            const healingReceived = 2 * this.tier
            const attackReceived = 1 * this.tier

            const bugleHealingEvent = new HealingReceivedEvent(healingReceived, event.turnActorPartyIndex, targetIndex, event)
            bugleEvents.push(bugleHealingEvent)

            target.attackMin += attackReceived
            target.attackMax += attackReceived

            newPartyStates[event.turnActorPartyIndex][targetIndex] = target

            combatMessage(`${target.name} gains ${healingReceived} HP and ${attackReceived} attack.`)
        }

        return {
            newPartyStates: newPartyStates,
            newEvents: bugleEvents
        }
    }
}