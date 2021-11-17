import { getRandomInt } from "../util/math"
import { Actor } from "./actor"
import { Event, EventData, EventKind } from "./events"
import { generateBigClubEvent } from "./events/bigClub"
import { generateSummonChickenEvent } from "./events/chumbyChicken"
import { DamageTakenEventData } from "./events/damageTaken"
import { generateMacheteEvent } from "./events/machete"
import { EventGeneratorMap, EnergyCostMap, ItemKind, Item } from './itemTypes'

export const itemEventGenerators: EventGeneratorMap = {
    [ItemKind.MACHETE]: generateMacheteEvent,
    [ItemKind.THORNS]: generateNoEvent,   //TODO: Change function
    [ItemKind.EXPLOSION_POWDER]: generateNoEvent, //TODO: Change function
    [ItemKind.KNIGHTS_LANCE]: generateNoEvent, //TODO: Change function
    [ItemKind.BIG_CLUB]: generateBigClubEvent,
    [ItemKind.CHUMBY_CHICKEN]: generateSummonChickenEvent,
}

export const itemEnergyCosts: EnergyCostMap = {
    [ItemKind.MACHETE]: 0,
    [ItemKind.THORNS]: 0,
    [ItemKind.EXPLOSION_POWDER]: 0,
    [ItemKind.KNIGHTS_LANCE]: 40,
    [ItemKind.BIG_CLUB]: 0,
    [ItemKind.CHUMBY_CHICKEN]: 0
}


function generateNoEvent(parties: Actor[][], attackerPartyIndex: number, attackerIndex: number, triggeredBy: Event): Event[] {
    return []
}

// this could be an abstract class
// that provides all the different item functionality as noops
    // how do we provide default implementations?
    // abstract class _Item then Item is concrete and has all the implementations?
// handleOnBasicAttack, handleOnTurn, handleOnNewFloor, etc