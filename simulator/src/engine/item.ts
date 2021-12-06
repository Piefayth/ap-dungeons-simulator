import { DungeonContext } from "../simulator"
import { getRandomInt } from "../util/math"
import { Actor } from "./actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "./events"
import { ActorDiedEvent } from "./events/actorDied"
import { BasicAttackEvent } from "./events/basicAttack"
import { BeforeTurnEvent } from "./events/beforeTurn"
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

    abstract handleOnBeforeTurn(ctx: DungeonContext, parties: Actor[][], event: BeforeTurnEvent): ProcessedEventResult
    abstract handleOnDungeonStart(ctx: DungeonContext, parties: Actor[][], ownerPartyIndex: number, ownerIndex: number): ProcessedEventResult
    abstract handleOnTurnStart(ctx: DungeonContext, parties: Actor[][], event: StartTurnEvent): ProcessedEventResult
    abstract handleOnDeath(ctx: DungeonContext, parties: Actor[][], diedPartyIndex: number, diedIndex: number): ProcessedEventResult
    abstract handleNewFloor(ctx: DungeonContext, parties: Actor[][], ownerPartyIndex: number, ownerIndex: number, floor: number): ProcessedEventResult
    abstract handleBeforeAttackerTargetFinalized(ctx: DungeonContext, parties: Actor[][], triggeredBy: SelectTargetEvent): SelectTargetEvent
    abstract handleBeforeDefenderTargetFinalized(ctx: DungeonContext, parties: Actor[][], itemHolderIndex: number, triggeredBy: SelectTargetEvent): SelectTargetEvent
    abstract handleOnTargetFinalized(ctx: DungeonContext, parties: Actor[][], triggeredBy: TargetFinalizedEvent): ProcessedEventResult
    abstract handleOnBasicAttack(ctx: DungeonContext, parties: Actor[][], damageDealt: number, triggeredBy: BasicAttackEvent): ProcessedEventResult
    abstract handleOnAfterAttack(ctx: DungeonContext, parties: Actor[][], triggeredBy: Event): ProcessedEventResult
    abstract handleOnDamageDealt(ctx: DungeonContext, parties: Actor[][], triggeredBy: DamageDealtEvent): ProcessedEventResult
    abstract handleOnKill(ctx: DungeonContext, parties: Actor[][], triggeredBy: ActorDiedEvent): ProcessedEventResult
}

export class Item extends _Item {
    handleOnBeforeTurn(ctx: DungeonContext, parties: Actor[][], event: BeforeTurnEvent): ProcessedEventResult {
        return {
            newPartyStates: parties,
            newEvents: []
        }
    }
    
    handleOnBasicAttack(ctx: DungeonContext, parties: Actor[][], damageDealt: number, triggeredBy: BasicAttackEvent): ProcessedEventResult {
        return {
            newPartyStates: parties,
            newEvents: []
        }
    }

    handleOnDamageDealt(ctx: DungeonContext, parties: Actor[][], triggeredBy: DamageDealtEvent): ProcessedEventResult {
        return {
            newPartyStates: parties,
            newEvents: []
        }
    }

    handleOnKill(ctx: DungeonContext, parties: Actor[][], triggeredBy: ActorDiedEvent): ProcessedEventResult {
        return {
            newPartyStates: parties,
            newEvents: []
        }
    }

    handleOnDungeonStart(ctx: DungeonContext, parties: Actor[][], ownerPartyIndex: number, ownerIndex: number): ProcessedEventResult {
        return {
            newPartyStates: parties,
            newEvents: []
        }
    }

    handleBeforeAttackerTargetFinalized(ctx: DungeonContext, parties: Actor[][], triggeredBy: SelectTargetEvent): SelectTargetEvent {
        return null
    }

    handleBeforeDefenderTargetFinalized(ctx: DungeonContext, parties: Actor[][], itemHolderIndex: number, triggeredBy: SelectTargetEvent): SelectTargetEvent {
        return null
    }

    handleOnTurnStart(ctx: DungeonContext, parties: Actor[][], event: StartTurnEvent): ProcessedEventResult {
        return {
            newPartyStates: parties,
            newEvents: []
        }
    }

    handleOnAfterAttack(ctx: DungeonContext, parties: Actor[][], triggeredBy: Event): ProcessedEventResult {
        return {
            newPartyStates: parties,
            newEvents: []
        }
    }

    handleOnDeath(ctx: DungeonContext, parties: Actor[][], diedPartyIndex: number, diedIndex: number): ProcessedEventResult {
        return {
            newPartyStates: parties,
            newEvents: []
        }
    }

    handleOnTargetFinalized(ctx: DungeonContext, parties: Actor[][], triggeredBy: TargetFinalizedEvent): ProcessedEventResult {
        return {
            newPartyStates: parties,
            newEvents: []
        }
    }

    handleNewFloor(ctx: DungeonContext, parties: Actor[][], ownerPartyIndex: number, ownerIndex: number, floor: number) : ProcessedEventResult {
        return {
            newPartyStates: parties,
            newEvents: []
        }
    }
}