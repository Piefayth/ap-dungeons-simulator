import { Actor } from "../engine/actor"
import { AuraKind, SeekingMissilesAura } from "../engine/aura"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { ActorDiedEvent } from "../engine/events/actorDied"
import { BeforeTurnEvent } from "../engine/events/beforeTurn"
import { DamageDealtEvent } from "../engine/events/damageDealt"
import { HealingReceivedEvent } from "../engine/events/healingReceived"
import { SelectTargetEvent } from "../engine/events/selectTarget"
import { TargetFinalizedEvent } from "../engine/events/targetFinalized"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { DungeonContext } from '../simulator'
import { getRandomInt } from "../util/math"

export class SeekingMissiles extends Item {
    constructor(tier: number) {
        let kind = ItemKind.SEEKING_MISSILES
        let name = ItemKind[ItemKind.SEEKING_MISSILES]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnBeforeTurn(ctx: DungeonContext, parties: Actor[][], event: BeforeTurnEvent): ProcessedEventResult {
        let beforeTurnEvents = []
        let attacker = parties[event.turnActorPartyIndex][event.turnActorIndex]
        let defenderPartyIndex = event.turnActorPartyIndex === 1 ? 0 : 1

        let firstLivingMember = parties[defenderPartyIndex].find(actor => !actor.dead)
        let targetIndex = parties[defenderPartyIndex].indexOf(firstLivingMember)
        let lowestHP = firstLivingMember.curHP

        for (let i = 0; i < parties[defenderPartyIndex].length; i++) {
            if (!parties[defenderPartyIndex][i].dead && parties[defenderPartyIndex][i].curHP < lowestHP) {
                lowestHP = parties[defenderPartyIndex][i].curHP
                targetIndex = i
            }
        }

        attacker.auras = attacker.auras.filter(aura => aura.kind !== AuraKind.SEEKING_MISSILES)

        attacker.auras.push({
            kind: AuraKind.SEEKING_MISSILES,
            stacks: 0,
            damage: 0,
            targetPartyIndex: defenderPartyIndex,
            targetIndex
        } as SeekingMissilesAura)

        parties[event.turnActorPartyIndex][event.turnActorIndex] = attacker

        return {
            newPartyStates: parties,
            newEvents: beforeTurnEvents
        }
    }

    handleBeforeAttackerTargetFinalized(ctx: DungeonContext, parties: Actor[][], triggeredBy: SelectTargetEvent): SelectTargetEvent {
        let attacker = parties[triggeredBy.attackerPartyIndex][triggeredBy.attackerIndex]
        let seeking = attacker.auras.find(aura => aura.kind === AuraKind.SEEKING_MISSILES) as SeekingMissilesAura

        let firstLivingMember = parties[triggeredBy.defenderPartyIndex].find(actor => !actor.dead)
        let newTargetIndex = parties[triggeredBy.defenderPartyIndex].indexOf(firstLivingMember)
        let lowestHP = firstLivingMember.curHP

        for (let i = 0; i < parties[triggeredBy.defenderPartyIndex].length; i++) {
            if (!parties[triggeredBy.defenderPartyIndex][i].dead && parties[triggeredBy.defenderPartyIndex][i].curHP < lowestHP) {
                lowestHP = parties[triggeredBy.defenderPartyIndex][i].curHP
                newTargetIndex = i
            }
        }

        seeking.targetIndex = newTargetIndex
        attacker.auras[attacker.auras.indexOf(seeking)] = seeking
        parties[triggeredBy.attackerPartyIndex][triggeredBy.attackerIndex] = attacker

        ctx.logCombatMessage(`${
            parties[triggeredBy.attackerPartyIndex][triggeredBy.attackerIndex].name
        } follows their seeking missiles and hunts down ${
            parties[triggeredBy.defenderPartyIndex][newTargetIndex].name
        }.`)
        
        return new SelectTargetEvent(
            triggeredBy.attackerPartyIndex,
            triggeredBy.attackerIndex,
            newTargetIndex,
        )
    }

    handleOnTargetFinalized(ctx: DungeonContext, parties: Actor[][], triggeredBy: TargetFinalizedEvent): ProcessedEventResult {
        let attacker = parties[triggeredBy.attackerPartyIndex][triggeredBy.attackerIndex]
        let seeking = attacker.auras.find(aura => aura.kind === AuraKind.SEEKING_MISSILES) as SeekingMissilesAura
        let defender = parties[triggeredBy.defenderPartyIndex][triggeredBy.defenderIndex]

        // Seeking missiles actually does 0.5 damage per tier per 10% hp missing
        // The double rounding here might not be 100% correct?
        // TODO: Test if this works better without operating on "chunks" of missing HP

        let hpPercentageMissing = 100 - (100 * (defender.curHP / defender.maxHP))
        let missilesMultiplier = Math.floor(hpPercentageMissing / 10)
        let missileDamage = Math.floor(0.5 * this.tier * missilesMultiplier)

        seeking.damage = missileDamage
        attacker.auras[attacker.auras.indexOf(seeking)] = seeking

        parties[triggeredBy.attackerPartyIndex][triggeredBy.attackerIndex] = attacker

        ctx.logCombatMessage(`Seeking Missiles deal an extra ${seeking.damage} damage.`)

        return {
            newPartyStates: parties,
            newEvents: []
        }
    }

    handleOnKill(ctx: DungeonContext, parties: Actor[][], triggeredBy: ActorDiedEvent): ProcessedEventResult {
        let onKillEvents = []

        const target = parties[triggeredBy.diedActorPartyIndex][triggeredBy.diedActorIndex]
        const attacker = parties[triggeredBy.turnActorPartyIndex][triggeredBy.turnActorIndex]

        const healingReceived = 6 * this.tier
        const healingReceivedEvent = new HealingReceivedEvent(healingReceived, triggeredBy.turnActorPartyIndex, triggeredBy.turnActorIndex)
        onKillEvents.push(healingReceivedEvent)

        ctx.logCombatMessage(`Seeking Missiles cook ${target.name} into a delicious meal! ${attacker.name} heals for ${healingReceived} HP.`)

        return {
            newPartyStates: parties,
            newEvents: onKillEvents
        }
    }
}