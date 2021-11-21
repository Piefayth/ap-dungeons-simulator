import { Actor } from "../engine/actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import * as _ from 'lodash'

export class Freezeman extends Item {
    constructor(tier: number) {
        let kind = ItemKind.FREEZEMAN
        let name = ItemKind[ItemKind.FREEZEMAN]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnDungeonStart(parties: Actor[][], ownerPartyIndex: number, ownerIndex: number): ProcessedEventResult {
        let newPartyStates = _.cloneDeep(parties)
        let owner = newPartyStates[ownerPartyIndex][ownerIndex]

        owner.speed += this.tier

        newPartyStates[ownerPartyIndex][ownerIndex] = owner

        return {
            newPartyStates,
            newEvents: []
        }
    }
}