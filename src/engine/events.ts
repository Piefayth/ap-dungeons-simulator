import { Actor } from "./actor"

enum EventKind {
    BASIC_ATTACK,
    MACHETE_ATTACK,
    DAMAGE_TAKEN,
    HEALING_RECEIVED,
    BIG_CLUB,
    SUMMON_CHUMBY_CHICKEN,
    CHICKEN_DIED,
}

interface EventData {}

type Event<T = EventData> = {
    kind: EventKind,
    attackerPartyIndex: number,
    attackerIndex: number,
    defenderPartyIndex: number,
    defenderIndex: number
    eventData: T
}

type ProcessedEventResult = {
    newPartyStates: Actor[][],
    newEvents: Event[]
}

export {
    Event,
    EventKind,
    EventData,
    ProcessedEventResult
}