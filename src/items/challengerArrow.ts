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

export class ChallengerArrow extends Item {
    constructor(tier: number) {
        let kind = ItemKind.CHALLENGER_ARROW
        let name = ItemKind[ItemKind.CHALLENGER_ARROW]
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

        const defenderPartyIndex = event.turnActorPartyIndex === 0 ? 1 : 0
        const arrowDamage = 10 * this.tier
        const arrowAttack = 1 * this.tier
        const arrowTarget = getRandomInt(0, newPartyStates[defenderPartyIndex].length)
        const triggeringEvent = new CombatEvent(
            EventKind.GENERIC_COMBAT,
            event.turnActorPartyIndex,
            event.turnActorIndex,
            defenderPartyIndex,
            arrowTarget
        )

        let arrowEvents: Event[] = []
        const damageDealtEvent = new DamageDealtEvent(arrowDamage, defenderPartyIndex, arrowTarget, triggeringEvent)
        arrowEvents.push(damageDealtEvent)

        attacker.attackMin += arrowAttack
        attacker.attackMax += arrowAttack
        attacker.energy -= this.energyCost
        newPartyStates[event.turnActorPartyIndex][event.turnActorIndex] = attacker

        combatMessage(`${attacker.name} draws their bow, hitting ${
            newPartyStates[defenderPartyIndex][arrowTarget].name
        } for ${arrowDamage} damage! Since ${
            newPartyStates[defenderPartyIndex][arrowTarget].name
        } was no match for ${attacker.name}, ${attacker.name} gains ${arrowAttack} attack.`)

        return {
            newPartyStates: newPartyStates,
            newEvents: arrowEvents
        }
    }
}