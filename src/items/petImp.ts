import { Actor } from "../engine/actor"
import { AuraKind } from "../engine/aura"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import { ChickenHealing } from "./chickenHealing"
import * as _ from 'lodash'
import { SummonActorEvent } from "../engine/events/summonActor"
import { combatMessage } from "../log"

export class PetImp extends Item {
    constructor(tier: number) {
        let kind = ItemKind.PET_IMP
        let name = ItemKind[ItemKind.PET_IMP]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnDungeonStart(parties: Actor[][], ownerPartyIndex: number, ownerIndex: number): ProcessedEventResult {
        const newPartyStates = _.cloneDeep(parties)

        const impBaseName = 'Pet Imp'
        const impsInParty = newPartyStates[ownerPartyIndex]
            .filter(it => it.name === impBaseName)
            .length

        const impName = impsInParty === 0 ? impBaseName : `${impBaseName} ${impsInParty + 1}`

        const imp = {
            name: impName,
            items: [],
            auras: [],
            maxHP: 10 * this.tier,
            curHP: 10 * this.tier,
            energy: 0,
            speed: 12 + (1 * this.tier),
            attackMin: 3 * this.tier,
            attackMax: 4 * this.tier,
            tier: this.tier,
            isSummoned: true
        }

        newPartyStates[ownerPartyIndex].push(imp)
        
        combatMessage(`${newPartyStates[ownerPartyIndex][ownerIndex].name}'s pet imp has joined the party! It will follow you as long as it lives.`)

        return {
            newPartyStates,
            newEvents: []
        }
    }
}