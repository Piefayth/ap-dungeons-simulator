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
import { forAllLivingActors } from "../util/actor"

export class ExplosionPowder extends Item {
    constructor(tier: number) {
        let kind = ItemKind.EXPLOSION_POWDER
        let name = ItemKind[ItemKind.EXPLOSION_POWDER]
        let energyCost = 60
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

        let powderEvents: Event[] = []
        const defenderPartyIndex = event.turnActorPartyIndex === 0 ? 1 : 0

        combatMessage(`Suddenly, the battlefield is covered in a thick powder. ${attacker.name} combusts the powder!`)

        newPartyStates = forAllLivingActors(newPartyStates, defenderPartyIndex, (actor, i) => {
            const powderDamageMin = 5 * this.tier
            const powderDamageMax = 10 * this.tier
            let powderDamage = getRandomInt(powderDamageMin, powderDamageMax + 1)

            if (newPartyStates[defenderPartyIndex].length === 1) {
                powderDamage *= 2
            }

            const damageDealtEvent = new DamageDealtEvent(powderDamage, defenderPartyIndex, i, event)
            powderEvents.push(damageDealtEvent)

            combatMessage(`${newPartyStates[defenderPartyIndex][i].name} takes ${powderDamage} damage from the sheer force of the massive explosion.`)

            return actor
        })

        attacker.energy -= this.energyCost
        newPartyStates[event.turnActorPartyIndex][event.turnActorIndex] = attacker

        return {
            newPartyStates: newPartyStates,
            newEvents: powderEvents
        }
    }
}