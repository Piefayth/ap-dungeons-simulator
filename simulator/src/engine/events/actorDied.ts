import { Actor } from "../actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../events"
import { DamageTakenEvent } from "./damageTaken"
import { DungeonContext } from "../../simulator"
import { CancelTurnEvent } from "./cancelTurn"

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
        let turnActor = partyStates[this.turnActorPartyIndex][this.turnActorIndex]

        diedActor.speed = 0             
        diedActor.pitySpeed = 0       
        diedActor.dead = true
        partyStates[this.diedActorPartyIndex][this.diedActorIndex] = diedActor

        for (let i = 0; i < diedActor.items.length; i++) {
            let result = diedActor.items[i].handleOnDeath(ctx, partyStates, this.diedActorPartyIndex, this.diedActorIndex)
            partyStates = result.newPartyStates
            actorDiedEvents = actorDiedEvents.concat(result.newEvents)
        }

        // if you die on your own turn (e.g. rough skin), cancel the rest of your turn after processing on death effects
        if (turnActor.dead) {
            actorDiedEvents.unshift(new CancelTurnEvent())

            return {
                newPartyStates: partyStates,
                newEvents: actorDiedEvents
            }
        }

        for (let i = 0; i < turnActor.items.length; i++) {
            let result = turnActor.items[i].handleOnKill(ctx, partyStates, this)
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