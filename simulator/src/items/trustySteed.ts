import { Actor } from "../engine/actor"
import { AuraKind } from "../engine/aura"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import { ChickenHealing } from "./chickenHealing"
import cloneDeep from 'lodash/cloneDeep'
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
        const newPartyStates = cloneDeep(parties)

        const steedBaseName = 'Trusty Steed'
        const steedName = getSummonedActorName(newPartyStates, ownerPartyIndex, steedBaseName)

        const steed = {
            name: steedName,
            items: [new BoostingBugle(this.tier)],
            auras: [],
            maxHP: 10 * this.tier,
            curHP: 10 * this.tier,
            energy: 55,
            speed: 20,
            attackMin: 0,
            attackMax: 0,
            tier: this.tier,
            isSummoned: true
        }

        newPartyStates[ownerPartyIndex].push(steed)
        
        ctx.logCombatMessage(`${newPartyStates[ownerPartyIndex][ownerIndex].name}'s trusty steed charges in and joins you in battle!`)

        return {
            newPartyStates,
            newEvents: []
        }
    }
}