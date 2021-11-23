import { Actor } from "../actor"
import { Event, EventKind, ProcessedEventResult } from "../events"
import cloneDeep from 'lodash/cloneDeep'
import { DungeonContext } from "../../simulator"
import { StartTurnEvent } from "./startTurn"

class BeforeTurnEvent extends Event {
    turnActorPartyIndex: number
    turnActorIndex: number

    constructor(turnActorPartyIndex: number, turnActorIndex: number) {
        super(EventKind.BEFORE_TURN)
        this.turnActorPartyIndex = turnActorPartyIndex
        this.turnActorIndex = turnActorIndex
    }

    processBeforeTurn(ctx: DungeonContext, parties: Actor[][]): ProcessedEventResult {
        let newPartyStates = cloneDeep(parties)
        let startTurnEvent = new StartTurnEvent(this.turnActorPartyIndex, this.turnActorIndex)
        let beforeTurnEvents: Event[] = [startTurnEvent]

        for (let k = 0; k < newPartyStates[this.turnActorPartyIndex][this.turnActorIndex].items.length; k++) {
            let item = newPartyStates[this.turnActorPartyIndex][this.turnActorIndex].items[k]
            let result = item.handleOnBeforeTurn(ctx, newPartyStates, this)
            beforeTurnEvents = beforeTurnEvents.concat(result.newEvents)
            newPartyStates = result.newPartyStates
        }
    
        return {
            newPartyStates,
            newEvents: beforeTurnEvents
        }
    }
}

export {
    BeforeTurnEvent
}