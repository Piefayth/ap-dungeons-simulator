import { Actor } from "../engine/actor"
import { AuraKind } from "../engine/aura"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
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

    handleOnDeath(ctx: DungeonContext, parties: Actor[][], diedPartyIndex: number, diedIndex: number): ProcessedEventResult {
        ctx.logCombatMessage('The party drools at the sight of accidentally cooked Chumby Chicken.')
    
        const newEvents: Event[] = []
        parties = forAllLivingActors(parties, diedPartyIndex, (actor, i) => {
            const healingReceived = 3 * this.tier
            const chickenHealingEvent = new HealingReceivedEvent(
                healingReceived,
                diedPartyIndex,
                i
            )

            newEvents.push(chickenHealingEvent)
            ctx.logCombatMessage(`${actor.name} takes a bite, it was very juicy and delicious. ${actor.name} gains ${healingReceived} HP`)

            return actor
        })

        return {
            newPartyStates: parties,
            newEvents: []
        }
    }
}