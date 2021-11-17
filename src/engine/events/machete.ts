import { getRandomInt } from "../../util/math"
import { Actor } from "../actor"
import { Event, EventData, EventKind } from "../events"
import { ItemKind } from "../itemTypes"
import { DamageTakenEventData } from "./damageTaken"

interface MacheteAttackEventData extends EventData {
    damageDealt: number
}

function generateMacheteEvent(parties: Actor[][], attackerPartyIndex: number, attackerIndex: number, triggeredBy: Event): Event[] {
    const defenderPartyIndex = attackerPartyIndex === 0 ? 1 : 0
    const macheteEvents: Event[] = []

    const attacker = parties[attackerPartyIndex][attackerIndex]
    const machete = attacker.items.find(it => it.kind === ItemKind.MACHETE)

    // don't generate the event if there's only one target
    if (parties[defenderPartyIndex].length <= 1) {
        return []
    }

    // select a defender that is not the target of the triggering basic attack
    let defenderIndex = -1
    while (defenderIndex < 0) {
        let tempDefender = getRandomInt(0, parties[defenderPartyIndex].length)
        if (tempDefender != triggeredBy.defenderIndex) {
            defenderIndex = tempDefender
        }
    }

    const macheteMinDamage = machete.tier * 3
    const macheteMaxDamage = machete.tier * 4

    const macheteSwingDamage = getRandomInt(macheteMinDamage, macheteMaxDamage + 1)
    const macheteEvent: Event<MacheteAttackEventData> = {
        ...triggeredBy,
        kind: EventKind.MACHETE_ATTACK,
        eventData: {
            damageDealt: macheteSwingDamage,
        }
    }

    macheteEvents.push(macheteEvent)

    return macheteEvents
}

function processMacheteAttack(partyStates: Actor[][], event: Event<MacheteAttackEventData>): Event[] {
    const damageTakenEvent: Event<DamageTakenEventData> = {
        ...event,
        kind: EventKind.DAMAGE_TAKEN,
        eventData: {
            damageTaken: event.eventData.damageDealt,
        }
    }

    console.log(`${
        partyStates[event.attackerPartyIndex][event.attackerIndex].name
    } slices and dices with their machete. ${
        partyStates[event.defenderPartyIndex][event.defenderIndex].name
    } gets caught up in it all and takes ${event.eventData.damageDealt} damage.`)

    return [damageTakenEvent]
}

export {
    MacheteAttackEventData,
    generateMacheteEvent,
    processMacheteAttack
}