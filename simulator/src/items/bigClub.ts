import { Actor } from "../engine/actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import cloneDeep from 'lodash/cloneDeep'
import { AuraKind } from "../engine/aura"
import { combatMessage } from "../log"

export class BigClub extends Item {
    constructor(tier: number) {
        let kind = ItemKind.BIG_CLUB
        let name = ItemKind[ItemKind.BIG_CLUB]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnTargetFinalized(parties: Actor[][], triggeredBy: CombatEvent): ProcessedEventResult {
        let newPartyStates = cloneDeep(parties)
        let attacker = newPartyStates[triggeredBy.attackerPartyIndex][triggeredBy.attackerIndex]
    
        const chance = 11 * this.tier
        const roll = getRandomInt(0, 100)
    
        if (roll < chance) {
            attacker.auras.push({
                kind: AuraKind.BIG_CLUB,
                stacks: 1
            })
        
            newPartyStates[triggeredBy.attackerPartyIndex][triggeredBy.attackerIndex] = attacker
        
            combatMessage(`${
                newPartyStates[triggeredBy.attackerPartyIndex][triggeredBy.attackerIndex].name
            } hits ${
                newPartyStates[triggeredBy.defenderPartyIndex][triggeredBy.defenderIndex].name
            } really hard with their big club, dealing an extra 150% bonus damage.`)
        
        }

        return {
            newPartyStates,
            newEvents: []
        }
    }
}