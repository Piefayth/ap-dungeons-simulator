import { Actor } from "../engine/actor";
import cloneDeep from 'lodash/cloneDeep'
import { getRandomInt } from "./math";

export function getRandomLivingActor(parties: Actor[][], partyIndex: number, ignoreCondition: (Actor, number) => boolean = () => true) {
    const party = parties[partyIndex]

    const livingMembers = party
        .filter(ignoreCondition)
        .filter(actor => actor.curHP > 0)

    if (livingMembers.length === 0) {
        return -1
    }

    const selectedLivingActor = getRandomInt(0, livingMembers.length)
    return party.indexOf(livingMembers[selectedLivingActor])
}

export function forAllLivingActors(parties: Actor[][], partyIndex: number, action: (Actor, number) => Actor): Actor[][] {
    let newPartyStates = cloneDeep(parties)
    
    for (let i = 0; i < newPartyStates[partyIndex].length; i++) {
        let actor = newPartyStates[partyIndex][i]
        if (actor.curHP <= 0) continue

        newPartyStates[partyIndex][i] = action(actor, i)
    }

    return newPartyStates
}

export function numLivingPartyMembers(parties: Actor[][], partyIndex: number) {
    return parties[partyIndex].filter(actor => actor.curHP > 0).length
}

// Debt: This could have better time complexity
export function getSummonedActorName(parties: Actor[][], partyIndex: number, summonBaseName) {
    const party = parties[partyIndex]
    const matchingSummonsInParty = party
        .filter(actor => actor.curHP > 0 && actor.name.includes(summonBaseName))

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