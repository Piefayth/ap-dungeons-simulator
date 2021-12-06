import { getRandomInt } from "../../util/math";
import { Actor } from "../actor";
import { AuraKind, SeekingMissilesAura } from "../aura";
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../events";
import { TargetFinalizedEvent } from "./targetFinalized";
import { DamageDealtEvent } from "./damageDealt";
import { AfterAttackEvent } from "./afterAttack";
import { getRandomLivingActor } from "../../util/actor";
import { DungeonContext } from "../../simulator";

class BasicAttackEvent extends CombatEvent {
    triggeredBy: TargetFinalizedEvent

    constructor(triggeredBy: TargetFinalizedEvent) {
        super(EventKind.BASIC_ATTACK, triggeredBy)
        this.triggeredBy = triggeredBy
    }

    processBasicAttack(ctx: DungeonContext, parties: Actor[][]): ProcessedEventResult {
        // resubmit the basic attack event if we are targeting something that died
        const attacker = parties[this.attackerPartyIndex][this.attackerIndex]
        const defender = parties[this.defenderPartyIndex][this.defenderIndex]
        if (defender === undefined) {
            const defenderIndex = getRandomLivingActor(parties, this.defenderPartyIndex)
            this.triggeredBy.defenderIndex = defenderIndex
            return {
                newPartyStates: parties,
                newEvents: [new BasicAttackEvent(this.triggeredBy)]
            }
        }

        
        const baseDamageDealt = getRandomInt(attacker.attackMin, attacker.attackMax + 1)
        let totalDamage = baseDamageDealt

        let resultEvents: Event[] = []

        for (let i = 0; i < attacker.items.length; i++) {
            const itemResult = attacker.items[i].handleOnBasicAttack(ctx, parties, baseDamageDealt, this)
            parties = itemResult.newPartyStates
            resultEvents = resultEvents.concat(itemResult.newEvents)
        }

        // TODO: Refactor this behavior into the item
        if (attacker.auras.some(it => it.kind === AuraKind.SEEKING_MISSILES)) {
            const seeking = attacker.auras.find(it => it.kind === AuraKind.SEEKING_MISSILES) as SeekingMissilesAura
            totalDamage += seeking.damage

            parties[this.attackerPartyIndex][this.attackerIndex] = attacker
        }

        // TODO: Refactor this behavior into the item
        if (attacker.auras.some(it => it.kind === AuraKind.BIG_CLUB)) {
            totalDamage *= 2.5
            totalDamage = Math.floor(totalDamage)
            
            attacker.auras = attacker.auras.filter(aura => aura.kind !== AuraKind.BIG_CLUB)
            parties[this.attackerPartyIndex][this.attackerIndex] = attacker
        }

        const damageDealtEvent = new DamageDealtEvent(totalDamage, this.defenderPartyIndex, this.defenderIndex, this, this.attackerIndex)
    
        resultEvents.unshift(damageDealtEvent)
        resultEvents.unshift(new AfterAttackEvent(this))
        
        ctx.logCombatMessage(`${
            parties[this.attackerPartyIndex][this.attackerIndex].name
        } attacks ${
            parties[this.defenderPartyIndex][this.defenderIndex].name
        } for ${totalDamage} damage.`)
    
        return {
            newEvents: resultEvents,
            newPartyStates: parties
        }
    }
}

export {
    BasicAttackEvent
}