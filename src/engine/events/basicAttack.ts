import { getRandomInt } from "../../util/math";
import { Actor } from "../actor";
import { AuraKind } from "../aura";
import { Event, EventData, EventKind, ProcessedEventResult } from "../events";
import { DamageTakenEventData } from "./damageTaken";
import * as _ from 'lodash'

interface BasicAttackEventData extends EventData {
    damageDealt: number
}

function generateBasicAttack(parties: Actor[][], attackerPartyIndex: number, attackerIndex: number): Event[] {
    const defenderPartyIndex = attackerPartyIndex === 0 ? 1 : 0
    const basicAttackEvents: Event[] = []

    const attacker = parties[attackerPartyIndex][attackerIndex]
    const defenderIndex = getRandomInt(0, parties[defenderPartyIndex].length)
    const attackerSwingBaseDamage = getRandomInt(attacker.attackMin, attacker.attackMax + 1)
    const basicAttackEvent: Event<BasicAttackEventData> = {
        kind: EventKind.BASIC_ATTACK,
        attackerPartyIndex,
        attackerIndex,
        defenderPartyIndex,
        defenderIndex,
        eventData: {
            damageDealt: attackerSwingBaseDamage,
        }
    }

    basicAttackEvents.push(basicAttackEvent)

    return basicAttackEvents
}

function processBasicAttack(partyStates: Actor[][], event: Event<BasicAttackEventData>): ProcessedEventResult {
    // resubmit the basic attack event if we are targeting something that died
    const attacker = partyStates[event.attackerPartyIndex][event.attackerIndex]
    const defender = partyStates[event.defenderPartyIndex][event.defenderIndex]
    if (attacker === undefined || defender === undefined) {
        return {
            newPartyStates: partyStates,
            newEvents: generateBasicAttack(partyStates, event.attackerPartyIndex, event.attackerIndex)
        }
    }

    let newPartyStates = _.cloneDeep(partyStates) as Actor[][]

    const baseDamageDealt = event.eventData.damageDealt
    let totalDamage = baseDamageDealt
    
    const resultEvents = []
    if (attacker.auras.some(it => it.kind === AuraKind.BIG_CLUB)) {
        totalDamage *= 2.5
        totalDamage = Math.floor(totalDamage)
        
        attacker.auras = attacker.auras.filter(aura => aura.kind !== AuraKind.BIG_CLUB)
        newPartyStates[event.attackerPartyIndex][event.attackerIndex] = attacker
    }

    const damageTakenEvent: Event<DamageTakenEventData> = {
        ...event,
        kind: EventKind.DAMAGE_TAKEN,
        eventData: {
            damageTaken: totalDamage
        }
    }

    resultEvents.push(damageTakenEvent)

    console.log(`${
        partyStates[event.attackerPartyIndex][event.attackerIndex].name
    } attacks ${
        partyStates[event.defenderPartyIndex][event.defenderIndex].name
    } for ${totalDamage} damage.`)

    return {
        newEvents: resultEvents,
        newPartyStates: partyStates
    }
}

export {
    BasicAttackEventData,
    generateBasicAttack,
    processBasicAttack
}