import { Actor } from "../engine/actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import { DungeonContext } from "../simulator"

export class Halberd extends Item {
    constructor(tier: number) {
        let kind = ItemKind.HALBERD
        let name = ItemKind[ItemKind.HALBERD]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnDungeonStart(ctx: DungeonContext, parties: Actor[][], ownerPartyIndex: number, ownerIndex: number): ProcessedEventResult {
        let owner = parties[ownerPartyIndex][ownerIndex]

        owner.attackMin += 2 * this.tier
        owner.attackMax += 2 * this.tier
        owner.curHP += 4 * this.tier
        owner.maxHP += 4 * this.tier

        parties[ownerPartyIndex][ownerIndex] = owner

        return {
            newPartyStates: parties,
            newEvents: []
        }
    }
}