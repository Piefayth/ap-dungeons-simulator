import { Actor } from "../actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../events"
import * as _ from 'lodash'

class ActorDiedEvent extends Event {
    actor: Actor
    triggeredBy: CombatEvent

    constructor(actor: Actor, triggeredBy: CombatEvent) {
        super(EventKind.ACTOR_DIED)
        this.actor = actor
        this.triggeredBy = triggeredBy
    }

    processActorDied(partyStates: Actor[][]): ProcessedEventResult {
        let newPartyStates = _.cloneDeep(partyStates)
        let actorDiedEvents: Event[] = []
    
        for (let i = 0; i < this.actor.items.length; i++) {
            let result = this.actor.items[i].handleOnDeath(newPartyStates, this.triggeredBy)
            newPartyStates = result.newPartyStates
            actorDiedEvents = actorDiedEvents.concat(result.newEvents)
        }

        return {
            newPartyStates,
            newEvents: actorDiedEvents
        }
    }
}

export {
    ActorDiedEvent
}