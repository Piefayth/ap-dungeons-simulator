import { Actor } from "../engine/actor"
import { AuraKind } from "../engine/aura"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import { ChickenHealing } from "./chickenHealing"
import * as _ from 'lodash'
import { SummonActorEvent } from "../engine/events/summonActor"
import { HealingPendant } from "./healingPendant"
import { combatMessage } from "../log"
import { getSummonedActorName } from "../util/actor"

export class RockCompanion extends Item {
    constructor(tier: number) {
        let kind = ItemKind.ROCK_COMPANION
        let name = ItemKind[ItemKind.ROCK_COMPANION]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnDungeonStart(parties: Actor[][], ownerPartyIndex: number, ownerIndex: number): ProcessedEventResult {
        const newPartyStates = _.cloneDeep(parties)

        const rockBaseName = 'Rock Companion'
        const rockName = getSummonedActorName(newPartyStates, ownerPartyIndex, rockBaseName)

        const rock = {
            name: rockName,
            items: [new HealingPendant(this.tier)],
            auras: [],
            maxHP: 15 * this.tier,
            curHP: 15 * this.tier,
            energy: 0,
            speed: 2,
            attackMin: 5 * this.tier,
            attackMax: 5 * this.tier,
            tier: this.tier,
            isSummoned: true
        }

        newPartyStates[ownerPartyIndex].push(rock)
        
        combatMessage(`${newPartyStates[ownerPartyIndex][ownerIndex].name}'s rock companion has joined the party! You can always count on this loyal rock to be there!`)

        return {
            newPartyStates,
            newEvents: []
        }
    }
}