import { Actor } from "./actor";
import { Event } from "./events";

export enum AuraKind {
    BIG_CLUB,
    POISON,
    SEEKING_MISSILES,
    CHICKEN_EXHAUSTION,
    CANNON_EXHAUSTION,
}

export type Aura = {
    kind: AuraKind,
    stacks: number
}

export interface SeekingMissilesAura extends Aura {
    damage: number,
    targetPartyIndex: number,
    targetIndex: number
}