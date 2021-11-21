import { Actor } from "../actor"
import { Event, EventKind, ProcessedEventResult } from "../events"
import cloneDeep from 'lodash/cloneDeep'
import { SelectTargetEvent } from "./selectTarget"
import { StartTurnItemEvent } from "./startTurnItem"

class StartTurnEvent extends Event {
    turnActorPartyIndex: number
    turnActorIndex: number

    constructor(turnActorPartyIndex: number, turnActorIndex: number) {
        super(EventKind.START_TURN)
        this.turnActorPartyIndex = turnActorPartyIndex
        this.turnActorIndex = turnActorIndex
    }

    processStartTurn(parties: Actor[][]): ProcessedEventResult {
        let newPartyStates = cloneDeep(parties)
        let selectTargetEvent = new SelectTargetEvent(this.turnActorPartyIndex, this.turnActorIndex)
        let startTurnEvents: Event[] = [selectTargetEvent]

        for (let k = 0; k < newPartyStates[this.turnActorPartyIndex][this.turnActorIndex].items.length; k++) {
            let item = newPartyStates[this.turnActorPartyIndex][this.turnActorIndex].items[k]
            startTurnEvents.push(new StartTurnItemEvent(item, this))
        }
    
        return {
            newPartyStates,
            newEvents: startTurnEvents
        }
    }
}

export {
    StartTurnEvent
}