import { Actor } from "../actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../events"
import { DamageTakenEvent } from "./damageTaken"
import { DungeonContext } from "../../simulator"

class ActorDiedEvent extends Event {
    diedActorIndex: number
    diedActorPartyIndex: number
    turnActorPartyIndex: number
    turnActorIndex: number
    triggeredBy: DamageTakenEvent

    constructor(actor: Actor, diedActorPartyIndex: number, diedActorIndex: number, turnActorPartyIndex: number, turnActorIndex: number) {
        super(EventKind.ACTOR_DIED)
        this.diedActorPartyIndex = diedActorPartyIndex
        this.diedActorIndex = diedActorIndex
        this.turnActorPartyIndex = turnActorPartyIndex
        this.turnActorIndex = turnActorIndex
    }

    processActorDied(ctx: DungeonContext, partyStates: Actor[][]): ProcessedEventResult {
        let actorDiedEvents: Event[] = []
        let diedActor = partyStates[this.diedActorPartyIndex][this.diedActorIndex]

        diedActor.speed = 0             
        diedActor.pitySpeed = 0       
        diedActor.dead = true

        // need to call handleOnDeath for the item owner's items
        // but also need to call handleOnKill for the ATTACKER's items
        // but that means we need to know whose turn it was when someone died

        for (let i = 0; i < diedActor.items.length; i++) {
            let result = diedActor.items[i].handleOnDeath(ctx, partyStates, this.diedActorPartyIndex, this.diedActorIndex)
            partyStates = result.newPartyStates
            actorDiedEvents = actorDiedEvents.concat(result.newEvents)
        }

        partyStates[this.diedActorPartyIndex][this.diedActorIndex] = diedActor

        return {
            newPartyStates: partyStates,
            newEvents: actorDiedEvents
        }
    }
}

export {
    ActorDiedEvent
}