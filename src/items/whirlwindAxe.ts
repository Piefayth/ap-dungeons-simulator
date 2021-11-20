import { Actor } from "../engine/actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { BasicAttackEvent } from "../engine/events/basicAttack"
import { DamageDealtEvent } from "../engine/events/damageDealt"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { combatMessage } from "../log"
import { getRandomInt } from "../util/math"

export class WhirlwindAxe extends Item {
    constructor(tier: number) {
        let kind = ItemKind.WHIRLWIND_AXE
        let name = ItemKind[ItemKind.WHIRLWIND_AXE]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnBasicAttack(parties: Actor[][], damageDealt: number, triggeredBy: BasicAttackEvent): ProcessedEventResult {
        const axeEvents: Event[] = []
    
        const attacker = parties[triggeredBy.attackerPartyIndex][triggeredBy.attackerIndex]
        const defender = parties[triggeredBy.defenderPartyIndex][triggeredBy.defenderIndex]

        const viableTargets = parties[triggeredBy.defenderPartyIndex]
            .filter(it => it.name !== defender.name)

        if (viableTargets.length <= 0) {
            return {
                newPartyStates: parties,
                newEvents: []
            }
        }

        combatMessage(`${attacker.name} swings their whirlwind axe wildly.`)

        for (let i = 0; i < parties[triggeredBy.defenderPartyIndex].length; i++) {
            if (i === triggeredBy.defenderIndex) continue

            const axeDamage = damageDealt
            const damageDealtEvent = new DamageDealtEvent(axeDamage, triggeredBy.defenderPartyIndex, i, triggeredBy)
            axeEvents.push(damageDealtEvent)

            combatMessage(`${parties[triggeredBy.defenderPartyIndex][i].name} is hit, taking ${axeDamage} damage`)
        }

        return {
            newPartyStates: parties,
            newEvents: axeEvents
        }
    }
}