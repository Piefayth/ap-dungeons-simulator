import { Actor } from "./actor";
import { Event } from "./events";

export enum AuraKind {
    BIG_CLUB,
    POISON,      // auras have stacks
    SEEKING_MISSILES, // ugh are we going to have to implement the damage amount as stacks
    CHICKEN_EXHAUSTION,
}

export type Aura = {
    kind: AuraKind,
    stacks: number
}