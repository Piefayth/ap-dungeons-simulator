import { Actor } from "../engine/actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import { DungeonContext } from "../simulator"

export class Freezeman extends Item {
    constructor(tier: number) {
        let kind = ItemKind.FREEZEMAN
        let name = ItemKind[ItemKind.FREEZEMAN]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnDungeonStart(ctx: DungeonContext, parties: Actor[][], ownerPartyIndex: number, ownerIndex: number): ProcessedEventResult {
        let owner = parties[ownerPartyIndex][ownerIndex]

        owner.speed += this.tier

        parties[ownerPartyIndex][ownerIndex] = owner

        return {
            newPartyStates: parties,
            newEvents: []
        }
    }
}