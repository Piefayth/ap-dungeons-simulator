import { Actor } from "./actor"

enum EventKind {
    GENERIC_COMBAT = 'Generic Combat',
    BEFORE_TURN = 'Before Turn',
    CANCEL_TURN = 'Cancel Turn',
    START_TURN = 'Start Turn',
    START_TURN_ITEM = 'Start Turn Item',
    SELECT_TARGET = 'Select Target',
    TARGET_FINALIZED = 'Target Finalized',
    AFTER_ATTACK = 'After Attack',
    BASIC_ATTACK = 'Basic Attack',
    BASIC_ATTACK_ITEM = 'Basic Attack Item',
    DAMAGE_TAKEN = 'Damage Taken',
    DAMAGE_DEALT = 'Damage Dealt',
    HEALING_RECEIVED = 'Healing Received',
    SUMMON_ACTOR = 'Summon Actor',
    ACTOR_DIED = 'Actor Died',
    END_TURN = 'End Turn'
}

abstract class Event {
    kind: EventKind

    constructor(kind: EventKind) {
        this.kind = kind
    }
}

class CombatEvent extends Event {
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