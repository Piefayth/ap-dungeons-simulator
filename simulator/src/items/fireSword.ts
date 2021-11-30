import { Actor } from "../engine/actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"

import { DungeonContext } from "../simulator"

export class FireSword extends Item {
    constructor(tier: number) {
        let kind = ItemKind.FIRE_SWORD
        let name = ItemKind[ItemKind.FIRE_SWORD]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnAfterAttack(ctx: DungeonContext, parties: Actor[][], triggeredBy: CombatEvent): ProcessedEventResult {
        let attacker = parties[triggeredBy.attackerPartyIndex][triggeredBy.attackerIndex]

        let attackGained = 0
        for (let i = 0; i < this.tier; i++) {
            let roll = getRandomInt(0, 100)
            if (roll < 30) {
                attackGained++
            }
        }

        if (attackGained > 0) {
            attacker.attackMin += attackGained
            attacker.attackMax += attackGained
            ctx.logCombatMessage(`${attacker.name}'s fire sword is getting them all fired up! They gain ${attackGained} attack.`)
        }
        

        parties[triggeredBy.attackerPartyIndex][triggeredBy.attackerIndex] = attacker

        return {
            newPartyStates: parties,
            newEvents: []
        }
    }
}