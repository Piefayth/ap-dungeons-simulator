import { Actor } from "../engine/actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../engine/events"
import { Item } from "../engine/item"
import { ItemKind } from "../engine/itemTypes"
import { getRandomInt } from "../util/math"
import { DungeonContext } from "../simulator"
import { StartTurnEvent } from "../engine/events/startTurn"
import { HealingReceivedEvent } from "../engine/events/healingReceived"
import { DamageTakenEvent } from "../engine/events/damageTaken"

export class CleansedTome extends Item {
    constructor(tier: number) {
        let kind = ItemKind.CLEANSED_TOME
        let name = ItemKind[ItemKind.CLEANSED_TOME]
        let energyCost = 0
        super(kind, name, tier, energyCost)
    }

    handleOnTurnStart(ctx: DungeonContext, parties: Actor[][], event: StartTurnEvent): ProcessedEventResult {
        let attacker = parties[event.turnActorPartyIndex][event.turnActorIndex]
        const tomeEvents: Event[] = []

        const tomeHealing = 3 * this.tier
        const tomeDamage = 1 * this.tier
        
        let tomeTarget = event.turnActorIndex
        let lowestHP = attacker.curHP

        for (let i = 0; i < parties[event.turnActorPartyIndex].length; i++) {
            if (parties[event.turnActorPartyIndex][i].isSummoned) continue

            if (
                parties[event.turnActorPartyIndex][i].curHP > 0 && 
                parties[event.turnActorPartyIndex][i].curHP < lowestHP &&
                parties[event.turnActorPartyIndex][i].curHP < parties[event.turnActorPartyIndex][i].maxHP
            ) {
                lowestHP = parties[event.turnActorPartyIndex][i].curHP
                tomeTarget = i
            }
        }

        const tomeHealingEvent = new HealingReceivedEvent(tomeHealing, event.turnActorPartyIndex, tomeTarget)
        const tomeDamageEvent = new DamageTakenEvent(tomeDamage, event.turnActorPartyIndex, event.turnActorIndex, null)
        tomeEvents.push(tomeHealingEvent)
        tomeEvents.push(tomeDamageEvent)

        ctx.logCombatMessage(`${attacker.name} uses their Cleansed Tome to heal ${parties[event.turnActorPartyIndex][tomeTarget].name}`)
        ctx.logCombatMessage(`${attacker.name} takes ${tomeDamage} damage.`)
        ctx.logCombatMessage(`${parties[event.turnActorPartyIndex][tomeTarget].name} heals ${tomeHealing} HP.`)

        return {
            newPartyStates: parties,
            newEvents: tomeEvents
        }
    }

    handleOnDungeonStart(ctx: DungeonContext, parties: Actor[][], ownerPartyIndex: number, ownerIndex: number): ProcessedEventResult {
        let owner = parties[ownerPartyIndex][ownerIndex]

        owner.curHP += 5 * this.tier
        owner.maxHP += 5 * this.tier

        parties[ownerPartyIndex][ownerIndex] = owner

        return {
            newPartyStates: parties,
            newEvents: []
        }
    }
}