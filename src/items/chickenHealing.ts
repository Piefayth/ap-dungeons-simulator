import { Actor } from "../engine/actor"
import { AuraKind } from "../engine/aura"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import * as _ from 'lodash'
import { HealingReceivedEvent } from "../engine/events/healingReceived"

export class ChickenHealing extends Item {
    constructor(tier: number) {
        let kind = ItemKind.CHICKEN_HEALING
        let name = ItemKind[ItemKind.CHICKEN_HEALING]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnDeath(parties: Actor[][], triggeredBy: CombatEvent): ProcessedEventResult {
        let newPartyStates = _.cloneDeep(parties)
        console.log('The party drools at the sight of accidentally cooked Chumby Chicken.')
    
        const newEvents: Event[] = []
        for (let i = 0; i < newPartyStates[triggeredBy.defenderPartyIndex].length; i++) {
            const actor = newPartyStates[triggeredBy.defenderPartyIndex][i]
            const healingReceived = 2 * this.tier
            const chickenHealingEvent = new HealingReceivedEvent(
                healingReceived,
                triggeredBy.defenderPartyIndex,
                i,
                triggeredBy
            )

            newEvents.push(chickenHealingEvent)
            console.log(`${actor.name} takes a bite, it was very juicy and delicious. ${actor.name} gains ${healingReceived} HP`)
        }

        return {
            newPartyStates: parties,
            newEvents: []
        }
    }
}