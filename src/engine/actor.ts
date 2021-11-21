import { Item } from "./item"
import { Aura } from './aura'

type Actor = {
    name: String,
    items: Item[],
    auras: Aura[],
    maxHP: number,
    curHP: number,
    energy: number,
    speed: number,
    attackMin: number,
    attackMax: number,
    pitySpeed?: number,
    tier?: number
    isSummoned?: boolean,
    dead?: boolean
}

export {
    Actor
}