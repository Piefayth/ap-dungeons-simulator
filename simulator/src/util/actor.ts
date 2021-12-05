import { Actor } from "../engine/actor";
import { getRandomInt } from "./math";

export function getRandomLivingActor(parties: Actor[][], partyIndex: number, ignoreCondition: (Actor, number) => boolean = () => true) {
    const party = parties[partyIndex]

    const livingMembers = party
        .filter(ignoreCondition)
        .filter(actor => !actor.dead)

    if (livingMembers.length === 0) {
        return -1
    }

    const selectedLivingActor = getRandomInt(0, livingMembers.length)
    return party.indexOf(livingMembers[selectedLivingActor])
}

export function forAllLivingActors(parties: Actor[][], partyIndex: number, action: (Actor, number) => Actor): Actor[][] {
    for (let i = 0; i < parties[partyIndex].length; i++) {
        let actor = parties[partyIndex][i]
        if (actor.dead) continue

        parties[partyIndex][i] = action(actor, i)
    }

    return parties
}

export function numLivingPartyMembers(parties: Actor[][], partyIndex: number) {
    return parties[partyIndex].filter(actor => !actor.dead).length
}

// Debt: This could have better time complexity
export function getSummonedActorName(parties: Actor[][], partyIndex: number, summonBaseName) {
    const party = parties[partyIndex]
    const matchingSummonsInParty = party
        .filter(actor => !actor.dead && actor.name.includes(summonBaseName))

    if (matchingSummonsInParty.length === 0) {
        return summonBaseName
    }

    let found = false
    let searched = 1

    while (found === false) {
        let foundDuplicate = false

        for (let i = 0; i < matchingSummonsInParty.length; i++) {
            let matchingSummon = matchingSummonsInParty[i]
            let numAsStringResult = matchingSummon.name.match(/\d+$/)

            let num = undefined

            if (!numAsStringResult) {
                num = 1
            } else {
                num = parseInt(numAsStringResult[0])
            }

            if (num === searched) {
                searched++
                foundDuplicate = true
                break
            }
        }

        if (!foundDuplicate) {
            found = true
        }
    }

    return summonBaseName + ' ' + searched
}