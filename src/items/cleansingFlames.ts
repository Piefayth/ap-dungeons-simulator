import { Actor } from "../engine/actor"
import { AuraKind } from "../engine/aura"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import * as _ from 'lodash'
import { HealingReceivedEvent } from "../engine/events/healingReceived"

export class CleansingFlames extends Item {
    constructor(tier: number) {
        let kind = ItemKind.CLEANSING_FLAMES
        let name = ItemKind[ItemKind.CLEANSING_FLAMES]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnAfterAttack(parties: Actor[][], triggeredBy: CombatEvent): ProcessedEventResult {
        let newPartyStates = _.cloneDeep(parties)
        let attacker = parties[triggeredBy.attackerPartyIndex][triggeredBy.attackerIndex]
        const newEvents: Event[] = []

        let roll = getRandomInt(0, 2)
        if (roll > 0) {
            console.log(`${attacker.name} douses their party in cleansing flames.`)
            for (let i = 0; i < newPartyStates[triggeredBy.attackerPartyIndex].length; i++) {
                const actor = newPartyStates[triggeredBy.attackerPartyIndex][i]
                const healingReceived = 1 * this.tier
                const flamesHealingEvent = new HealingReceivedEvent(healingReceived, triggeredBy.attackerPartyIndex, i, triggeredBy)
                newEvents.push(flamesHealingEvent)
                console.log(`${actor.name} gains ${healingReceived} HP.`)
            }
        }

        return {
            newPartyStates: newPartyStates,
            newEvents: newEvents
        }
    }
}