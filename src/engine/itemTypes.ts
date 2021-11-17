import { Actor } from './actor'
import { Event } from './events'

export enum ItemKind {
    THORNS = 'Thorns',
    EXPLOSION_POWDER = 'Explosion Powder',
    MACHETE = 'Machete',
    KNIGHTS_LANCE = 'Knight\'s Lance',
    BIG_CLUB = 'Big Club',
    CHUMBY_CHICKEN = 'Celine\'s Chumby Chicken'
}

export type Item = {
    kind: ItemKind,
    tier: number
}

export type EventGeneratorMap = {
    [index in ItemKind]: (parties: Actor[][], attackerPartyIndex: number, attackerIndex: number, triggeredBy: Event) => Event[]
}

export type EnergyCostMap = {
    [index in ItemKind]: number
}