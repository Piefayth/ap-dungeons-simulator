import { Actor } from "../engine/actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import cloneDeep from 'lodash/cloneDeep'
import { DungeonContext } from "../simulator"
import { BeforeTurnEvent } from "../engine/events/beforeTurn"
import { AuraKind } from "../engine/aura"
import { CancelTurnEvent } from "../engine/events/cancelTurn"

export class BFCannon extends Item {
    constructor(tier: number) {
        let kind = ItemKind.BF_CANNON
        let name = ItemKind[ItemKind.BF_CANNON]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnDungeonStart(ctx: DungeonContext, parties: Actor[][], ownerPartyIndex: number, ownerIndex: number): ProcessedEventResult {
        let newPartyStates = cloneDeep(parties)
        let owner = newPartyStates[ownerPartyIndex][ownerIndex]

        owner.attackMin += 6 + (6 * this.tier)
        owner.attackMax += 6 + (6 * this.tier)
        owner.curHP += 10 * this.tier
        owner.maxHP += 10 * this.tier

        newPartyStates[ownerPartyIndex][ownerIndex] = owner

        return {
            newPartyStates,
            newEvents: []
        }
    }

    handleOnBeforeTurn(ctx: DungeonContext, parties: Actor[][], event: BeforeTurnEvent): ProcessedEventResult {
        let newPartyStates = cloneDeep(parties)
        let beforeTurnEvents = []
        let attacker = newPartyStates[event.turnActorPartyIndex][event.turnActorIndex]
        let cannonAuras = attacker.auras.find(aura => aura.kind === AuraKind.CANNON_EXHAUSTION)

        if (cannonAuras) {
            attacker.auras = attacker.auras.filter(aura => aura.kind !== AuraKind.CANNON_EXHAUSTION)
            beforeTurnEvents.push(new CancelTurnEvent())
            ctx.logCombatMessage(`Still recovering from the cannons recoil, ${attacker.name} takes a minute to rest.`)
        } else {
            attacker.auras.push({
                kind: AuraKind.CANNON_EXHAUSTION,
                stacks: 1
            })
            ctx.logCombatMessage('You load up the giant cannon and fire.')
        }

        newPartyStates[event.turnActorPartyIndex][event.turnActorIndex] = attacker

        return {
            newPartyStates: newPartyStates,
            newEvents: beforeTurnEvents
        }
    }
}