import { Actor } from "../engine/actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import * as _ from 'lodash'
import { combatMessage } from "../log"

export class DrainingDagger extends Item {
    constructor(tier: number) {
        let kind = ItemKind.DRAINING_DAGGER
        let name = ItemKind[ItemKind.DRAINING_DAGGER]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnTargetFinalized(parties: Actor[][], triggeredBy: CombatEvent): ProcessedEventResult {
        let newPartyStates = _.cloneDeep(parties)
        let attacker = newPartyStates[triggeredBy.attackerPartyIndex][triggeredBy.attackerIndex]
        let defender = newPartyStates[triggeredBy.defenderPartyIndex][triggeredBy.defenderIndex]
        
        let potentialAttackDrained = 1 * this.tier
        let actualAttackDrained = Math.min(defender.attackMin, potentialAttackDrained)
        defender.attackMin -= actualAttackDrained
        defender.attackMax -= actualAttackDrained

        combatMessage(`${attacker.name}'s draining dagger drains ${defender.name}. ${defender.name} loses ${actualAttackDrained} attack.`)

        let chance = 5 * this.tier
        let roll = getRandomInt(0, 100)
        if (roll < chance) {
            defender.energy = Math.max(0, defender.energy - 1)
            attacker.energy += 1
            combatMessage(`Draining dagger saps ${defender.name}'s energy.`)
        }


        newPartyStates[triggeredBy.attackerPartyIndex][triggeredBy.attackerIndex] = attacker
        newPartyStates[triggeredBy.defenderPartyIndex][triggeredBy.defenderIndex] = defender

        return {
            newPartyStates,
            newEvents: []
        }
    }
}