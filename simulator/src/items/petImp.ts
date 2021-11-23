import { Actor } from "../engine/actor"
import { AuraKind } from "../engine/aura"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import { ChickenHealing } from "./chickenHealing"
import cloneDeep from 'lodash/cloneDeep'
import { SummonActorEvent } from "../engine/events/summonActor"

import { getSummonedActorName } from "../util/actor"
import { DungeonContext } from "../simulator"

export class PetImp extends Item {
    constructor(tier: number) {
        let kind = ItemKind.PET_IMP
        let name = ItemKind[ItemKind.PET_IMP]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnDungeonStart(ctx: DungeonContext, parties: Actor[][], ownerPartyIndex: number, ownerIndex: number): ProcessedEventResult {
        const newPartyStates = cloneDeep(parties)

        const impBaseName = 'Pet Imp'
        const impName = getSummonedActorName(newPartyStates, ownerPartyIndex, impBaseName)

        const imp = {
            name: impName,
            items: [],
            auras: [],
            maxHP: 10 * this.tier,
            curHP: 10 * this.tier,
            energy: 0,
            speed: 16,
            attackMin: 3 * this.tier,
            attackMax: 4 * this.tier,
            tier: this.tier,
            isSummoned: true
        }

        newPartyStates[ownerPartyIndex].push(imp)
        
        ctx.logCombatMessage(`${newPartyStates[ownerPartyIndex][ownerIndex].name}'s pet imp has joined the party! It will follow you as long as it lives.`)

        return {
            newPartyStates,
            newEvents: []
        }
    }
}