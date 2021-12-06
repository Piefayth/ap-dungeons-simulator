import { Actor } from "../actor"
import { Event, EventKind, ProcessedEventResult } from "../events"
import { SelectTargetEvent } from "./selectTarget"
import { StartTurnItemEvent } from "./startTurnItem"
import { DungeonContext } from "../../simulator"
import { CheckDeathsEvent } from "./checkDeaths"

class StartTurnEvent extends Event {
    turnActorPartyIndex: number
    turnActorIndex: number

    constructor(turnActorPartyIndex: number, turnActorIndex: number) {
        super(EventKind.START_TURN)
        this.turnActorPartyIndex = turnActorPartyIndex
        this.turnActorIndex = turnActorIndex
    }

    processStartTurn(ctx: DungeonContext, parties: Actor[][]): ProcessedEventResult {
        const selectTargetEvent = new SelectTargetEvent(this.turnActorPartyIndex, this.turnActorIndex)
        const checkDeathsEvent = new CheckDeathsEvent(this.turnActorPartyIndex, this.turnActorIndex)

        let startTurnEvents: Event[] = [selectTargetEvent, checkDeathsEvent]

        for (let k = 0; k < parties[this.turnActorPartyIndex][this.turnActorIndex].items.length; k++) {
            let item = parties[this.turnActorPartyIndex][this.turnActorIndex].items[k]
            startTurnEvents.push(new StartTurnItemEvent(item, this))
        }
    
        return {
            newPartyStates: parties,
            newEvents: startTurnEvents
        }
    }
}

export {
    StartTurnEvent
}