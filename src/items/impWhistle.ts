import { Actor } from "../engine/actor"
import { AuraKind } from "../engine/aura"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import { ChickenHealing } from "./chickenHealing"
import * as _ from 'lodash'
import { SummonActorEvent } from "../engine/events/summonActor"
import { StartTurnEvent } from "../engine/events/startTurn"
import { combatMessage } from "../log"

export class ImpWhistle extends Item {
    constructor(tier: number) {
        let kind = ItemKind.IMP_WHISTLE
        let name = ItemKind[ItemKind.IMP_WHISTLE]
        let energyCost = 45
        super(kind, name, tier, energyCost)
    }

    handleOnTurnStart(parties: Actor[][], triggeredBy: StartTurnEvent): ProcessedEventResult {
        const newPartyStates = _.cloneDeep(parties)
        const impWhistleEvents: Event[] = []
        const attacker = newPartyStates[triggeredBy.turnActorPartyIndex][triggeredBy.turnActorIndex]

        if (attacker.energy < this.energyCost) {
            return {
                newPartyStates: parties,
                newEvents: []
            }
        }

        const impBaseName = 'Small Imp Companion'

        // TODO: This and ALL other summoning events have the same problem
        // This check only works for the FIRST summon, won't correctly replace #1 if it dies (will make 2 pet imp 2)
        // Fix pls :(

        const impsInParty = newPartyStates[triggeredBy.turnActorPartyIndex]
            .filter(it => it.name === impBaseName)
            .length

        const impName = impsInParty === 0 ? impBaseName : `${impBaseName} ${impsInParty + 1}`
        const impWhistleEvent = new SummonActorEvent({
            name: impName,
            items: [],
            auras: [],
            maxHP: this.tier,
            curHP: this.tier,
            energy: 0,
            speed: 11 + (1 * this.tier),
            attackMin: 3 * this.tier,
            attackMax: 4 * this.tier,
            tier: this.tier,
            isSummoned: true
        }, triggeredBy.turnActorPartyIndex)

        impWhistleEvents.push(impWhistleEvent)

        combatMessage(`${attacker.name} blows their whistle, calling for help!`)
        combatMessage('A nearby friend comes to our aid.')

        attacker.energy -= this.energyCost
        newPartyStates[triggeredBy.turnActorPartyIndex][triggeredBy.turnActorIndex] = attacker

        return {
            newPartyStates,
            newEvents: impWhistleEvents
        }
    }
}