import { Actor } from "../engine/actor"
import { AuraKind } from "../engine/aura"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import cloneDeep from 'lodash/cloneDeep'
import { HealingReceivedEvent } from "../engine/events/healingReceived"

import { forAllLivingActors } from "../util/actor"
import { DamageTakenEvent } from "../engine/events/damageTaken"
import { DungeonContext } from "../simulator"

export class ChickenHealing extends Item {
    constructor(tier: number) {
        let kind = ItemKind.CHICKEN_HEALING
        let name = ItemKind[ItemKind.CHICKEN_HEALING]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnDeath(ctx: DungeonContext, parties: Actor[][], triggeredBy: DamageTakenEvent): ProcessedEventResult {
        let newPartyStates = cloneDeep(parties)
        ctx.logCombatMessage('The party drools at the sight of accidentally cooked Chumby Chicken.')
    
        const newEvents: Event[] = []
        newPartyStates = forAllLivingActors(newPartyStates, triggeredBy.targetPartyIndex, (actor, i) => {
            const healingReceived = 2 * this.tier
            const chickenHealingEvent = new HealingReceivedEvent(
                healingReceived,
                triggeredBy.targetPartyIndex,
                i,
                triggeredBy
            )

            newEvents.push(chickenHealingEvent)
            ctx.logCombatMessage(`${actor.name} takes a bite, it was very juicy and delicious. ${actor.name} gains ${healingReceived} HP`)

            return actor
        })

        return {
            newPartyStates: newPartyStates,
            newEvents: []
        }
    }
}