import { Actor } from "../engine/actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import cloneDeep from 'lodash/cloneDeep'

export class Halberd extends Item {
    constructor(tier: number) {
        let kind = ItemKind.HALBERD
        let name = ItemKind[ItemKind.HALBERD]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnDungeonStart(parties: Actor[][], ownerPartyIndex: number, ownerIndex: number): ProcessedEventResult {
        let newPartyStates = cloneDeep(parties)
        let owner = newPartyStates[ownerPartyIndex][ownerIndex]

        owner.attackMin += 2 * this.tier
        owner.attackMax += 2 * this.tier

        newPartyStates[ownerPartyIndex][ownerIndex] = owner

        return {
            newPartyStates,
            newEvents: []
        }
    }
}