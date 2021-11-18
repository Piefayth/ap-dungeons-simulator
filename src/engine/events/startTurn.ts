import { Actor } from "../actor"
import { Event, EventKind, ProcessedEventResult } from "../events"
import * as _ from 'lodash'
import { SelectTargetEvent } from "./selectTarget"

class StartTurnEvent extends Event {
    turnActorPartyIndex: number
    turnActorIndex: number

    constructor(turnActorPartyIndex: number, turnActorIndex: number) {
        super(EventKind.START_TURN)
        this.turnActorPartyIndex = turnActorPartyIndex
        this.turnActorIndex = turnActorIndex
    }

    processStartTurn(parties: Actor[][]): ProcessedEventResult {
        let newPartyStates = _.cloneDeep(parties)
        let selectTargetEvent = new SelectTargetEvent(this.turnActorPartyIndex, this.turnActorIndex)
        let startTurnEvents: Event[] = [selectTargetEvent]

        for (let k = 0; k < parties[this.turnActorPartyIndex][this.turnActorIndex].items.length; k++) {
            let item = parties[this.turnActorPartyIndex][this.turnActorIndex].items[k]
            let result = item.handleOnTurnStart(parties, this)
            newPartyStates = result.newPartyStates
            startTurnEvents = startTurnEvents.concat(result.newEvents)
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