import { Actor } from "../engine/actor"
import { AuraKind } from "../engine/aura"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import { ChickenHealing } from "./chickenHealing"
import { SummonActorEvent } from "../engine/events/summonActor"
import { HealingPendant } from "./healingPendant"

import { getSummonedActorName } from "../util/actor"
import { DungeonContext } from "../simulator"
import { BoostingBugle } from "./boostingBugle"

export class TrustySteed extends Item {
    constructor(tier: number) {
        let kind = ItemKind.TRUSTY_STEED
        let name = ItemKind[ItemKind.TRUSTY_STEED]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnDungeonStart(ctx: DungeonContext, parties: Actor[][], ownerPartyIndex: number, ownerIndex: number): ProcessedEventResult {
        const steedBaseName = 'Trusty Steed'
        const steedName = getSummonedActorName(parties, ownerPartyIndex, steedBaseName)

        const steed = {
            name: steedName,
            items: [new BoostingBugle(this.tier)],
            auras: [],
            maxHP: 10 * this.tier,
            curHP: 10 * this.tier,
            energy: 40,
            speed: 20,
            attackMin: 0,
            attackMax: 0,
            tier: this.tier,
            isSummoned: true
        }

        parties[ownerPartyIndex].push(steed)
        
        ctx.logCombatMessage(`${parties[ownerPartyIndex][ownerIndex].name}'s trusty steed charges in and joins you in battle!`)

        return {
            newPartyStates: parties,
            newEvents: []
        }
    }
}