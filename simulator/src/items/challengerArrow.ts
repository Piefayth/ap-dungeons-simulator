import { Actor } from "../engine/actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { DamageDealtEvent } from "../engine/events/damageDealt"
import { StartTurnEvent } from "../engine/events/startTurn"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import { HealingReceivedEvent } from "../engine/events/healingReceived"

import { getRandomLivingActor } from "../util/actor"
import { DungeonContext } from "../simulator"
import { AuraKind, SeekingMissilesAura } from "../engine/aura"

export class ChallengerArrow extends Item {
    constructor(tier: number) {
        let kind = ItemKind.CHALLENGER_ARROW
        let name = ItemKind[ItemKind.CHALLENGER_ARROW]
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

        let seeking = attacker.auras.find(aura => aura.kind === AuraKind.SEEKING_MISSILES) as SeekingMissilesAura

        const defenderPartyIndex = event.turnActorPartyIndex === 0 ? 1 : 0
        const arrowDamage = 10 * this.tier
        const arrowAttack = 2 * this.tier

        const arrowTarget = seeking ? seeking.targetIndex : getRandomLivingActor(parties, defenderPartyIndex)

        let arrowEvents: Event[] = []
        const damageDealtEvent = new DamageDealtEvent(arrowDamage, defenderPartyIndex, arrowTarget, event, event.turnActorIndex)
        arrowEvents.push(damageDealtEvent)

        attacker.attackMin += arrowAttack
        attacker.attackMax += arrowAttack
        attacker.energy -= this.energyCost
        parties[event.turnActorPartyIndex][event.turnActorIndex] = attacker

        ctx.logCombatMessage(`${attacker.name} draws their bow, hitting ${
            parties[defenderPartyIndex][arrowTarget].name
        } for ${arrowDamage} damage! Since ${
            parties[defenderPartyIndex][arrowTarget].name
        } was no match for ${attacker.name}, ${attacker.name} gains ${arrowAttack} attack.`)

        return {
            newPartyStates: parties,
            newEvents: arrowEvents
        }
    }
}