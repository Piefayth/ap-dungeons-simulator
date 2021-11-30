import { Actor } from "../actor"
import { Event, EventKind, ProcessedEventResult } from "../events"
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
        let startTurnEvent = new StartTurnEvent(this.turnActorPartyIndex, this.turnActorIndex)
        let beforeTurnEvents: Event[] = [startTurnEvent]

        for (let k = 0; k < parties[this.turnActorPartyIndex][this.turnActorIndex].items.length; k++) {
            let item = parties[this.turnActorPartyIndex][this.turnActorIndex].items[k]
            let result = item.handleOnBeforeTurn(ctx, parties, this)
            beforeTurnEvents = beforeTurnEvents.concat(result.newEvents)
            parties = result.newPartyStates
        }
    
        return {
            newPartyStates: parties,
            newEvents: beforeTurnEvents
        }
    }
}

export {
    BeforeTurnEvent
}