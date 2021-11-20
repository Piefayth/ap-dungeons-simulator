import { Actor } from "../actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../events"
import * as _ from 'lodash'


class DamageTakenEvent extends CombatEvent {
    damageTaken: number
    targetPartyIndex: number
    targetIndex: number

    // TODO: this probably shouldn't be or provide access to a CombatEvent at all
    // It would be incorrect to use some of CombatEvent's properties here
    constructor(damageTaken: number, targetPartyIndex: number, targetIndex: number, triggeredBy: CombatEvent) {
        super(EventKind.DAMAGE_TAKEN, triggeredBy)
        this.damageTaken = damageTaken
        this.targetPartyIndex = targetPartyIndex
        this.targetIndex = targetIndex
    }

    processDamageTaken(partyStates: Actor[][]): ProcessedEventResult {
        let newPartyStates = _.cloneDeep(partyStates)
        let defender = newPartyStates[this.targetPartyIndex][this.targetIndex]
        let newEvents = []
        console.log('taken defender party index: ' + this.targetPartyIndex)
        console.log('taken defender index: ' + this.targetIndex)
        let updatedDefender = {
            ...defender,
            curHP: Math.max(0, defender.curHP -= this.damageTaken)
        }

        newPartyStates[this.targetPartyIndex][this.targetIndex] = updatedDefender
    
        return {
            newPartyStates,
            newEvents
        }
    }
}

export {
    DamageTakenEvent
}