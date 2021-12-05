import { Actor } from "../actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../events"
import { DamageTakenEvent } from "./damageTaken"
import { DungeonContext } from "../../simulator"

class ActorDiedEvent extends Event {
    actorIndex: number
    actorPartyIndex: number
    triggeredBy: DamageTakenEvent

    constructor(actor: Actor, actorPartyIndex: number, actorIndex: number) {
        super(EventKind.ACTOR_DIED)
        this.actorPartyIndex = actorPartyIndex
        this.actorIndex = actorIndex
    }

    processActorDied(ctx: DungeonContext, partyStates: Actor[][]): ProcessedEventResult {
        let actorDiedEvents: Event[] = []
        let actor = partyStates[this.actorPartyIndex][this.actorIndex]

        actor.speed = 0             
        actor.pitySpeed = 0       
        actor.dead = true

        for (let i = 0; i < actor.items.length; i++) {
            let result = actor.items[i].handleOnDeath(ctx, partyStates, this.actorPartyIndex, this.actorIndex)
            partyStates = result.newPartyStates
            actorDiedEvents = actorDiedEvents.concat(result.newEvents)
        }

        partyStates[this.actorPartyIndex][this.actorIndex] = actor

        return {
            newPartyStates: partyStates,
            newEvents: actorDiedEvents
        }
    }
}

export {
    ActorDiedEvent
}