import { Actor } from "../engine/actor";
import * as _ from 'lodash'

export function getNextActorID(parties: Actor[][]) {
    let highestId = 0

    for (let i = 0; i < parties.length; i++) {
        for (let j = 0; j < parties[i].length; j++) {
            let existingId = parties[i][j].actorID
            if (existingId !== undefined && existingId > highestId) {
                highestId = existingId
            }
        }
    }

    return highestId + 1
}

export function setInitialActorIDs(parties: Actor[][]) {
    let newPartyStates = _.cloneDeep(parties)
    let id = 0

    for (let i = 0; i < parties.length; i++) {
        for (let j = 0; j < parties[i].length; j++) {
            parties[i][j].actorID = id
            id++
        }
    }

    return newPartyStates
}