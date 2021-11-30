import { Actor } from "../actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../events"
import { DamageTakenEvent } from "./damageTaken"
import { DungeonContext } from "../../simulator"

class ActorDiedEvent extends Event {
    actor: Actor
    triggeredBy: DamageTakenEvent

    constructor(actor: Actor, triggeredBy: DamageTakenEvent) {
        super(EventKind.ACTOR_DIED)
        this.actor = actor
        this.triggeredBy = triggeredBy
    }

    processActorDied(ctx: DungeonContext, partyStates: Actor[][]): ProcessedEventResult {
        let actorDiedEvents: Event[] = []
    
        for (let i = 0; i < this.actor.items.length; i++) {
            let result = this.actor.items[i].handleOnDeath(ctx, partyStates, this.triggeredBy)
            partyStates = result.newPartyStates
            actorDiedEvents = actorDiedEvents.concat(result.newEvents)
        }

        return {
            newPartyStates: partyStates,
            newEvents: actorDiedEvents
        }
    }
}

export {
    ActorDiedEvent
}