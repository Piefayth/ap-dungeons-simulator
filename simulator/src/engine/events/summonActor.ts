import { Actor } from "../actor"
import { Event, EventKind, ProcessedEventResult } from "../events"
import cloneDeep from 'lodash/cloneDeep'

class SummonActorEvent extends Event {
    actor: Actor
    targetPartyIndex: number

    constructor(actor: Actor, targetPartyIndex: number) {
        super(EventKind.SUMMON_ACTOR)
        this.actor = actor
        this.targetPartyIndex = targetPartyIndex
    }

    processSummonActor(partyStates: Actor[][]): ProcessedEventResult {
        let newPartyStates = cloneDeep(partyStates)
    
        newPartyStates[this.targetPartyIndex].push({
            ...this.actor,
            isSummoned: true
        })
        
        return {
            newPartyStates,
            newEvents: []
        }
    }
}

export {
    SummonActorEvent
}