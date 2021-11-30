import { Actor } from "../actor"
import { Event, EventKind, ProcessedEventResult } from "../events"
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
        let startTurnItemEvents: Event[] = []

        const result = this.item.handleOnTurnStart(ctx, parties, this.triggeredBy)
        parties = result.newPartyStates
        startTurnItemEvents = startTurnItemEvents.concat(result.newEvents)

        return {
            newPartyStates: parties,
            newEvents: startTurnItemEvents
        }
    }
}