import { Actor } from "../engine/actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { DamageTakenEvent } from "../engine/events/damageTaken"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"

export class Machete extends Item {
    constructor(tier: number) {
        let kind = ItemKind.MACHETE
        let name = 'Machete'
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnTargetFinalized(parties: Actor[][], triggeredBy: CombatEvent): ProcessedEventResult {
        const defenderPartyIndex = triggeredBy.attackerPartyIndex === 0 ? 1 : 0
        const macheteEvents: Event[] = []
    
        const attacker = parties[triggeredBy.attackerPartyIndex][triggeredBy.attackerIndex]
        const machete = attacker.items.find(it => it.kind === ItemKind.MACHETE)
    
        // don't deal machete damage if there's only one target
        if (parties[defenderPartyIndex].length <= 1) {
            return {
                newPartyStates: parties,
                newEvents: []
            }
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
        const damageTakenEvent = new DamageTakenEvent(macheteSwingDamage, defenderPartyIndex, defenderIndex, triggeredBy)
    
        macheteEvents.push(damageTakenEvent)

        console.log(`${
            parties[triggeredBy.attackerPartyIndex][triggeredBy.attackerIndex].name
        } slices and dices with their machete. ${
            parties[defenderPartyIndex][defenderIndex].name
        } gets caught up in it all and takes ${macheteSwingDamage} damage.`)
        
        return {
            newPartyStates: parties,
            newEvents: macheteEvents
        }
    }
}