import { Actor } from "../actor";
import { AuraKind } from "../aura";
import { Event, EventData, EventKind, ProcessedEventResult } from "../events";
import { ItemKind } from "../itemTypes";
import { HealingReceivedEventData } from "./healingReceived";
import * as _ from 'lodash'

interface SummonChickenEventData extends EventData {
    chicken: Actor
}

interface ChickenDiedEventData extends EventData {
    chickenPartyIndex: number
    chickenTier: number
}

function generateSummonChickenEvent(
    parties: Actor[][], 
    attackerPartyIndex: number, 
    attackerIndex: number, 
    triggeredBy: Event
): Event[] {
    const chumbyChickenEvents = []
    const attacker = parties[attackerPartyIndex][attackerIndex]
    if (!attacker.auras.some(it => it.kind === AuraKind.CHICKEN_EXHAUSTION)) {
        // search party for chickens to get an appropriate chicken name
        const chickensInParty = parties[attackerPartyIndex]
            .filter(it => it.name === `Celine's Chumby Chicken`)
            .length

        const chumbyChicken = attacker.items.find(it => it.kind === ItemKind.CHUMBY_CHICKEN)
        const chickenName = chickensInParty === 0 ? `Celine's Chumby Chicken` : `Celine's Chumby Chicken ${chickensInParty + 1}`
        const chumbyChickenEvent: Event<SummonChickenEventData> = {
            ...triggeredBy,
            kind: EventKind.SUMMON_CHUMBY_CHICKEN,
            eventData: {
                chicken: {
                    name: chickenName,
                    items: [],
                    auras: [],
                    maxHP: chumbyChicken.tier,
                    curHP: chumbyChicken.tier,
                    energy: 0,
                    speed: 1,
                    attackMin: 0,
                    attackMax: 1,
                    tier: chumbyChicken.tier,
                    isSummoned: true
                }
            }
        }
        chumbyChickenEvents.push(chumbyChickenEvent)
    }

    return chumbyChickenEvents
}

function processSummonChickenEvent(partyStates: Actor[][], event: Event<SummonChickenEventData>): Actor[][] {
    let newPartyStates = _.cloneDeep(partyStates)

    let attackingTeam = partyStates[event.attackerPartyIndex]
    let attacker = attackingTeam[event.attackerIndex]

    attackingTeam.push(event.eventData.chicken)
    attacker.auras.push({
        kind: AuraKind.CHICKEN_EXHAUSTION,
        stacks: 1
    })

    attackingTeam[event.attackerIndex] = attacker
    newPartyStates[event.attackerPartyIndex] = attackingTeam

    console.log(`${attacker.name} summons a Celine's Chumby Chicken.`)

    return newPartyStates
}

function generateChickenDiedEvent(
    parties: Actor[][],
    chickenPartyIndex: number,
    chicken: Actor,
    triggeredBy: Event
): Event[] {
    const chickenDiedEvents = []

    const chickenDiedEvent: Event<ChickenDiedEventData> = {
        ...triggeredBy,
        kind: EventKind.CHICKEN_DIED,
        eventData: {
            chickenPartyIndex,
            chickenTier: chicken.tier
        }
    }
    chickenDiedEvents.push(chickenDiedEvent)

    return chickenDiedEvents
}

function processChickenDiedEvent(partyStates: Actor[][], event: Event<ChickenDiedEventData>): ProcessedEventResult {
    let newPartyStates = _.cloneDeep(partyStates)
    console.log('The party drools at the sight of accidentally cooked Chumby Chicken.')

    const newEvents: Event[] = []
    for (let i = 0; i < partyStates[event.eventData.chickenPartyIndex].length; i++) {
        const actor = partyStates[event.eventData.chickenPartyIndex][i]
        const chickenHealingEvent: Event<HealingReceivedEventData> = {
            ...event,
            kind: EventKind.HEALING_RECEIVED,
            eventData: {
                healingReceived: 2 * event.eventData.chickenTier,
                targetIndex: i,
                targetPartyIndex: event.eventData.chickenPartyIndex
            }
        }
        newEvents.push(chickenHealingEvent)
        console.log(`${actor.name} takes a bite, it was very juicy and delicious. ${actor.name} gains 2HP`)
    }

    return {
        newPartyStates,
        newEvents
    }
}

export {
    SummonChickenEventData,
    generateSummonChickenEvent,
    processSummonChickenEvent,
    ChickenDiedEventData,
    generateChickenDiedEvent,
    processChickenDiedEvent
}