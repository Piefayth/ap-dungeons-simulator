import { Actor } from "../actor"
import { Event, EventKind, ProcessedEventResult } from "../events"
import cloneDeep from 'lodash/cloneDeep'
import { DungeonContext } from "../../simulator"
import { StartTurnEvent } from "./startTurn"

class CancelTurnEvent extends Event {
    constructor() {
        super(EventKind.CANCEL_TURN)
    }
}

export {
    CancelTurnEvent
}