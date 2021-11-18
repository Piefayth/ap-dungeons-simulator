import { Actor } from "./actor"

enum EventKind {
    START_TURN = 'Start Turn',
    SELECT_TARGET = 'Select Target',
    TARGET_FINALIZED = 'Target Finalized',
    AFTER_ATTACK = 'After Attack',
    BASIC_ATTACK = 'Basic Attack',
    DAMAGE_TAKEN = 'Damage Taken',
    HEALING_RECEIVED = 'Healing Received',
    SUMMON_ACTOR = 'Summon Actor',
    ACTOR_DIED = 'Actor Died',
}

abstract class Event {
    kind: EventKind

    constructor(kind: EventKind) {
        this.kind = kind
    }
}

abstract class CombatEvent extends Event {
    attackerPartyIndex: number
    attackerIndex: number
    defenderPartyIndex: number
    defenderIndex: number

    constructor(kind: EventKind, attackerPartyIndexOrTriggeredBy: number | CombatEvent, attackerIndex?: number, defenderPartyIndex?: number, defenderIndex?: number) {
        super(kind)

        if (typeof attackerPartyIndexOrTriggeredBy == "number") {
            this.attackerIndex = attackerIndex
            this.attackerPartyIndex = attackerPartyIndexOrTriggeredBy
            this.defenderIndex = defenderIndex
            this.defenderPartyIndex = defenderPartyIndex
        } else {
            this.attackerIndex = attackerPartyIndexOrTriggeredBy.attackerIndex
            this.attackerPartyIndex = attackerPartyIndexOrTriggeredBy.attackerPartyIndex
            this.defenderIndex = attackerPartyIndexOrTriggeredBy.defenderIndex
            this.defenderPartyIndex = attackerPartyIndexOrTriggeredBy.defenderPartyIndex
        }

    }

}

type ProcessedEventResult = {
    newPartyStates: Actor[][],
    newEvents: Event[]
}

export {
    Event,
    CombatEvent,
    EventKind,
    ProcessedEventResult
}