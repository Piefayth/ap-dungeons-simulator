import { getRandomInt } from "../../util/math"
import { Actor } from "../actor"
import { AuraKind } from "../aura"
import { Event, EventData, EventKind } from "../events"
import { ItemKind } from "../itemTypes"
import { DamageTakenEventData } from "./damageTaken"
import * as _ from 'lodash'

interface BigClubEventData extends EventData {}

function generateBigClubEvent(parties: Actor[][], attackerPartyIndex: number, attackerIndex: number, triggeredBy: Event): Event[] {
    const defenderPartyIndex = attackerPartyIndex === 0 ? 1 : 0
    const bigClubEvents: Event[] = []

    const attacker = parties[attackerPartyIndex][attackerIndex]
    const defenderIndex = getRandomInt(0, parties[defenderPartyIndex].length)

    // check if we should fire the event at all
    const bigClub = attacker.items.find(it => it.kind === ItemKind.BIG_CLUB)
    const chance = 11 * bigClub.tier
    const roll = getRandomInt(0, 100)

    if (roll < chance) {
        const bigClubEvent: Event<BigClubEventData> = {
            kind: EventKind.BIG_CLUB,
            attackerPartyIndex,
            attackerIndex,
            defenderPartyIndex,
            defenderIndex,
            eventData: {}
        }
        bigClubEvents.push(bigClubEvent)
    }

    return bigClubEvents
}

function processBigClubEvent(partyStates: Actor[][], event: Event<BigClubEventData>): Actor[][] {
    let newPartyStates = _.cloneDeep(partyStates)
    let attacker = newPartyStates[event.attackerPartyIndex][event.attackerIndex]

    const bigClub = attacker.items.find(it => it.kind === ItemKind.BIG_CLUB)

    attacker.auras.push({
        kind: AuraKind.BIG_CLUB,
        stacks: 1
    })

    newPartyStates[event.attackerPartyIndex][event.attackerIndex] = attacker

    console.log(`${
        partyStates[event.attackerPartyIndex][event.attackerIndex].name
    } hits ${
        partyStates[event.defenderPartyIndex][event.defenderIndex].name
    } really hard with their big club, dealing an extra 150% bonus damage.`)

    return newPartyStates
}

export {
    BigClubEventData,
    generateBigClubEvent,
    processBigClubEvent
}