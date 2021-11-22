import { Actor } from "../engine/actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { BasicAttackEvent } from "../engine/events/basicAttack"
import { DamageDealtEvent } from "../engine/events/damageDealt"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"

import { DungeonContext } from "../simulator"
import { forAllLivingActors } from "../util/actor"
import { getRandomInt } from "../util/math"

export class WhirlwindAxe extends Item {
    constructor(tier: number) {
        let kind = ItemKind.WHIRLWIND_AXE
        let name = ItemKind[ItemKind.WHIRLWIND_AXE]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnBasicAttack(ctx: DungeonContext, parties: Actor[][], damageDealt: number, triggeredBy: BasicAttackEvent): ProcessedEventResult {
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

        ctx.logCombatMessage(`${attacker.name} swings their whirlwind axe wildly.`)
        forAllLivingActors(parties, triggeredBy.defenderPartyIndex, (actor, i) => {
            if (i === triggeredBy.defenderIndex) return actor

            const axeDamage = damageDealt
            const damageDealtEvent = new DamageDealtEvent(axeDamage, triggeredBy.defenderPartyIndex, i, triggeredBy, triggeredBy.attackerIndex)
            axeEvents.push(damageDealtEvent)

            ctx.logCombatMessage(`${parties[triggeredBy.defenderPartyIndex][i].name} is hit, taking ${axeDamage} damage`)
        })

        return {
            newPartyStates: parties,
            newEvents: axeEvents
        }
    }
}