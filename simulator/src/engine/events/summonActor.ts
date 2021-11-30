import { Actor } from "../actor"
import { Event, EventKind, ProcessedEventResult } from "../events"
import { DungeonContext } from "../../simulator"

class SummonActorEvent extends Event {
    actor: Actor
    targetPartyIndex: number

    constructor(actor: Actor, targetPartyIndex: number) {
        super(EventKind.SUMMON_ACTOR)
        this.actor = actor
        this.targetPartyIndex = targetPartyIndex
    }

    processSummonActor(ctx: DungeonContext, partyStates: Actor[][]): ProcessedEventResult {   
        partyStates[this.targetPartyIndex].push({
            ...this.actor,
            isSummoned: true
        })
        
        return {
            newPartyStates: partyStates,
            newEvents: []
        }
    }
}

export {
    SummonActorEvent
}