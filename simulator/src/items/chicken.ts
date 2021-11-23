import { Actor } from "../engine/actor"
import { AuraKind } from "../engine/aura"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import { ChickenHealing } from "./chickenHealing"
import cloneDeep from 'lodash/cloneDeep'
import { SummonActorEvent } from "../engine/events/summonActor"
import { StartTurnEvent } from "../engine/events/startTurn"

import { getSummonedActorName } from "../util/actor"
import { DungeonContext } from "../simulator"

export const CHUMBY_CHICKEN_NAME = `Chumby Chicken`

export class ChumbyChicken extends Item {
    constructor(tier: number) {
        let kind = ItemKind.CHUMBY_CHICKEN
        let name = ItemKind[ItemKind.CHUMBY_CHICKEN]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnTurnStart(ctx: DungeonContext, parties: Actor[][], triggeredBy: StartTurnEvent): ProcessedEventResult {
        const newPartyStates = cloneDeep(parties)
        const chumbyChickenEvents = []
        const attacker = newPartyStates[triggeredBy.turnActorPartyIndex][triggeredBy.turnActorIndex]

        if (!attacker.auras.some(it => it.kind === AuraKind.CHICKEN_EXHAUSTION)) {
            const chickenBaseName = CHUMBY_CHICKEN_NAME
            const chickenName = getSummonedActorName(newPartyStates, triggeredBy.turnActorPartyIndex, chickenBaseName)
            
            const chumbyChickenEvent = new SummonActorEvent({
                name: chickenName,
                items: [new ChickenHealing(this.tier)],
                auras: [],
                maxHP: this.tier,
                curHP: this.tier,
                energy: 0,
                speed: 1,
                attackMin: 0,
                attackMax: 1,
                tier: this.tier,
                isSummoned: true
            }, triggeredBy.turnActorPartyIndex)

            chumbyChickenEvents.push(chumbyChickenEvent)
            ctx.logCombatMessage(`${attacker.name} summons a Chumby Chicken.`)
        
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

    handleNewFloor(ctx: DungeonContext, parties: Actor[][], ownerPartyIndex: number, ownerIndex: number, floor: number): ProcessedEventResult {
        let newPartyStates = cloneDeep(parties)

        newPartyStates[ownerPartyIndex][ownerIndex].auras = newPartyStates[ownerPartyIndex][ownerIndex].auras
            .filter(aura => aura.kind !== AuraKind.CHICKEN_EXHAUSTION)

        return {
            newPartyStates,
            newEvents: []
        }
    }
}