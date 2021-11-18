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

export class ChumbyChicken extends Item {
    constructor(tier: number) {
        let kind = ItemKind.CHUMBY_CHICKEN
        let name = `Celine's Chumby Chicken`
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnTurnStart(parties: Actor[][], triggeredBy: StartTurnEvent): ProcessedEventResult {
        const newPartyStates = _.cloneDeep(parties)
        const chumbyChickenEvents = []
        const attacker = newPartyStates[triggeredBy.turnActorPartyIndex][triggeredBy.turnActorIndex]

        if (!attacker.auras.some(it => it.kind === AuraKind.CHICKEN_EXHAUSTION)) {
            const chickensInParty = newPartyStates[triggeredBy.turnActorPartyIndex]
                .filter(it => it.name === `Celine's Chumby Chicken`)
                .length

            const chumbyChicken = attacker.items.find(it => it.kind === ItemKind.CHUMBY_CHICKEN)
            const chickenName = chickensInParty === 0 ? `Celine's Chumby Chicken` : `Celine's Chumby Chicken ${chickensInParty + 1}`
            const chumbyChickenEvent = new SummonActorEvent({
                name: chickenName,
                items: [new ChickenHealing(chumbyChicken.tier)],
                auras: [],
                maxHP: chumbyChicken.tier,
                curHP: chumbyChicken.tier,
                energy: 0,
                speed: 1,
                attackMin: 0,
                attackMax: 1,
                tier: chumbyChicken.tier,
                isSummoned: true
            }, triggeredBy.turnActorPartyIndex)

            chumbyChickenEvents.push(chumbyChickenEvent)
            console.log(`${attacker.name} summons a Celine's Chumby Chicken.`)
        
            newPartyStates[triggeredBy.turnActorPartyIndex][triggeredBy.turnActorIndex].auras.push({
                kind: AuraKind.CHICKEN_EXHAUSTION,
                stacks: 1
            })
        }
        
        return {
            newPartyStates,
            newEvents: chumbyChickenEvents
        }
    }

    handleNewFloor(parties: Actor[][], ownerPartyIndex: number, ownerIndex: number, floor: number): ProcessedEventResult {
        let newPartyStates = _.cloneDeep(parties)

        newPartyStates[ownerPartyIndex][ownerIndex].auras = newPartyStates[ownerPartyIndex][ownerIndex].auras
            .filter(aura => aura.kind !== AuraKind.CHICKEN_EXHAUSTION)

        return {
            newPartyStates,
            newEvents: []
        }
    }
}