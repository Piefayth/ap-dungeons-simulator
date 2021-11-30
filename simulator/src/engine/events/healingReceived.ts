import { Actor } from "../actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../events"
import { DungeonContext } from "../../simulator"

class HealingReceivedEvent extends Event {
    healingReceived: number
    targetPartyIndex: number
    targetIndex: number

    constructor(healingReceived: number, targetPartyIndex: number, targetIndex: number, triggeredBy: Event) {
        super(EventKind.HEALING_RECEIVED)
        this.healingReceived = healingReceived
        this.targetPartyIndex = targetPartyIndex
        this.targetIndex = targetIndex
    }

    processHealingReceived(ctx: DungeonContext, partyStates: Actor[][]): ProcessedEventResult {
        let target = partyStates[this.targetPartyIndex][this.targetIndex]

        let updatedTarget = {
            ...target,
            curHP: Math.min(target.maxHP, target.curHP + this.healingReceived)
        }
    
        partyStates[this.targetPartyIndex][this.targetIndex] = updatedTarget
    
        return {
            newPartyStates: partyStates,
            newEvents: []
        }
    }
}

export {
    HealingReceivedEvent
}