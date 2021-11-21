import { getRandomInt } from "../util/math"
import { Actor } from "./actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "./events"
import { BasicAttackEvent } from "./events/basicAttack"
import { DamageDealtEvent } from "./events/damageDealt"
import { SelectTargetEvent } from "./events/selectTarget"
import { StartTurnEvent } from "./events/startTurn"
import { TargetFinalizedEvent } from "./events/targetFinalized"
import { ItemKind } from './itemTypes'

abstract class _Item {
    kind: ItemKind
    name: string
    tier: number
    energyCost: number

    constructor(kind: ItemKind, name: string, tier: number, energyCost: number) {
        this.kind = kind
        this.name = name
        this.tier = tier
        this.energyCost = energyCost
    }

    abstract handleOnDungeonStart(parties: Actor[][], ownerPartyIndex: number, ownerIndex: number): ProcessedEventResult
    abstract handleOnTurnStart(parties: Actor[][], event: StartTurnEvent): ProcessedEventResult
    abstract handleOnDeath(parties: Actor[][], triggeredBy: Event): ProcessedEventResult
    abstract handleNewFloor(parties: Actor[][], ownerPartyIndex: number, ownerIndex: number, floor: number): ProcessedEventResult
    abstract handleBeforeAttackerTargetFinalized(parties: Actor[][], triggeredBy: SelectTargetEvent): SelectTargetEvent
    abstract handleBeforeDefenderTargetFinalized(parties: Actor[][], itemHolderIndex: number, triggeredBy: SelectTargetEvent): SelectTargetEvent
    abstract handleOnTargetFinalized(parties: Actor[][], triggeredBy: TargetFinalizedEvent): ProcessedEventResult
    abstract handleOnBasicAttack(parties: Actor[][], damageDealt: number, triggeredBy: BasicAttackEvent): ProcessedEventResult
    abstract handleOnAfterAttack(parties: Actor[][], triggeredBy: Event): ProcessedEventResult
    abstract handleOnDamageDealt(parties: Actor[][], triggeredBy: DamageDealtEvent): ProcessedEventResult
}

export class Item extends _Item {
    handleOnBasicAttack(parties: Actor[][], damageDealt: number, triggeredBy: BasicAttackEvent): ProcessedEventResult {
        return {
            newPartyStates: parties,
            newEvents: []
        }
    }

    handleOnDamageDealt(parties: Actor[][], triggeredBy: DamageDealtEvent): ProcessedEventResult {
        return {
            newPartyStates: parties,
            newEvents: []
        }
    }

    handleOnDungeonStart(parties: Actor[][], ownerPartyIndex: number, ownerIndex: number): ProcessedEventResult {
        return {
            newPartyStates: parties,
            newEvents: []
        }
    }

    handleBeforeAttackerTargetFinalized(parties: Actor[][], triggeredBy: SelectTargetEvent): SelectTargetEvent {
        return null
    }

    handleBeforeDefenderTargetFinalized(parties: Actor[][], itemHolderIndex: number, triggeredBy: SelectTargetEvent): SelectTargetEvent {
        return null
    }

    handleOnTurnStart(parties: Actor[][], event: StartTurnEvent): ProcessedEventResult {
        return {
            newPartyStates: parties,
            newEvents: []
        }
    }

    handleOnAfterAttack(parties: Actor[][], triggeredBy: Event): ProcessedEventResult {
        return {
            newPartyStates: parties,
            newEvents: []
        }
    }

    handleOnDeath(parties: Actor[][], triggeredBy: Event): ProcessedEventResult {
        return {
            newPartyStates: parties,
            newEvents: []
        }
    }

    handleOnTargetFinalized(parties: Actor[][], triggeredBy: TargetFinalizedEvent): ProcessedEventResult {
        return {
            newPartyStates: parties,
            newEvents: []
        }
    }

    handleNewFloor(parties: Actor[][], ownerPartyIndex: number, ownerIndex: number, floor: number) : ProcessedEventResult {
        return {
            newPartyStates: parties,
            newEvents: []
        }
    }
}