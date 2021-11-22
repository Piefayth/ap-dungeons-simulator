import { Actor } from "../actor"
import { Event, EventKind, ProcessedEventResult } from "../events"
import cloneDeep from 'lodash/cloneDeep'
import { StartTurnEvent } from "./startTurn"
import { Item } from "../item"
import { DungeonContext } from "../../simulator"

export class StartTurnItemEvent extends Event {
    item: Item
    triggeredBy: StartTurnEvent

    constructor(item: Item, triggeredBy: StartTurnEvent) {
        super(EventKind.START_TURN_ITEM)
        this.item = item
        this.triggeredBy = triggeredBy
    }

    processStartTurnItem(ctx: DungeonContext, parties: Actor[][]): ProcessedEventResult {
        let newPartyStates = cloneDeep(parties)
        let startTurnItemEvents: Event[] = []

        const result = this.item.handleOnTurnStart(ctx, newPartyStates, this.triggeredBy)
        newPartyStates = result.newPartyStates
        startTurnItemEvents = startTurnItemEvents.concat(result.newEvents)

        return {
            newPartyStates,
            newEvents: startTurnItemEvents
        }
    }
}