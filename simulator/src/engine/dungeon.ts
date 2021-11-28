import cloneDeep from 'lodash/cloneDeep'
import { getRandomInt } from '../util/math'
import { Actor } from './actor'
import { 
    CombatEvent,
    Event, 
    EventKind,
    ProcessedEventResult, 
} from './events'
import { BasicAttackEvent } from './events/basicAttack'
import { DamageDealtEvent } from './events/damageDealt'
import { HealingReceivedEvent } from './events/healingReceived'
import { SummonActorEvent } from './events/summonActor'
import { ActorDiedEvent } from './events/actorDied'
import { StartTurnEvent } from './events/startTurn'
import { SelectTargetEvent } from './events/selectTarget'
import { TargetFinalizedEvent } from './events/targetFinalized'
import { AfterAttackEvent } from './events/afterAttack'
import { EndTurnEvent } from './events/endTurn'
import { StartTurnItemEvent } from './events/startTurnItem'
import { DamageTakenEvent } from './events/damageTaken'
import { DungeonContext } from '../simulator'
import { KnightsLance } from '../items'
import { BeforeTurnEvent } from './events/beforeTurn'

type Floor = {
    enemies: Actor[]
}

type Dungeon = {
    tier: number,
    floors: Floor[]
}

type DungeonResult = {
    won: boolean,
}

function startDungeon(ctx: DungeonContext, dungeon: Dungeon, party: Actor[]): DungeonResult {
    let parties = cloneDeep([party, []])
    
    // TODO: Move dungeon start and floor start to events
    // Without this, can't use summon actor event for pet summons

    for (let i = 0; i < parties.length; i++) {
        for (let j = 0; j < parties[i].length; j++) {
            for (let k = 0; k < parties[i][j].items.length; k++) {
                let result = parties[i][j].items[k].handleOnDungeonStart(ctx, parties, i, j)
                parties = result.newPartyStates
            }
        }
    }

    for (let f = 0; f < dungeon.floors.length; f++) {
        ctx.logCombatMessage(`Starting floor ${f}`)
        parties[1] = cloneDeep(dungeon.floors[f].enemies)
        
        // handle new floor actions for items
        for (let i = 0; i < parties.length; i++) {
            for (let j = 0; j < parties[i].length; j++) {
                for (let k = 0; k < parties[i][j].items.length; k++) {
                    let result = parties[i][j].items[k].handleNewFloor(ctx, parties, i, j, f)
                    parties = result.newPartyStates
                }
            }
        }

        ctx.logPartyStates(parties)
        ctx.endTurn()

        while (whichPartyDied(parties) === null) {
            parties = simulateFloor(ctx, parties)
        }
        
        if (whichPartyDied(parties) === 0) {
            ctx.logPartyStates(parties)
            ctx.endTurn()
            return {
                won: false,
            }
        }
    }
    
    ctx.logPartyStates(parties)
    ctx.endTurn()

    return {
        won: true,
    }
}

function simulateFloor(ctx: DungeonContext, parties: Actor[][]): Actor[][] {
    const turnActorSelection = determineTurn(parties[0], parties[1])
    let newPartyState = applyPitySpeed(ctx, parties, turnActorSelection)
    newPartyState = prepareTurn(newPartyState)
    const beforeTurnEvent = new BeforeTurnEvent(turnActorSelection.partyID, turnActorSelection.partyIndex)
    newPartyState = processTurnEvents(ctx, newPartyState, [beforeTurnEvent])

    let deadParty = whichPartyDied(parties)
    if (deadParty !== null) {
        return newPartyState
    }

    ctx.logPartyStates(newPartyState)
    ctx.endTurn()

    return newPartyState
}

function prepareTurn(parties: Actor[][]): Actor[][] {
    let newPartyState = cloneDeep(parties)

    newPartyState = newPartyState.map(party => 
        party.map(actor => {
            actor.energy += 2
            return actor
        })
    )

    return newPartyState
}

function whichPartyDied(parties: Actor[][]): number | null {
    for (let i = 0; i < parties.length; i++) {
        let partyRemainingHP = parties[i]
            .reduce((acc, cur) => acc + Math.max(0, cur.curHP), 0)

        if (partyRemainingHP <= 0) {
            return i
        }
    }

    return null
}

function processTurnEvents(ctx: DungeonContext, parties: Actor[][], events: Event[]): Actor[][] {
    let newPartyStates = cloneDeep(parties)
    let localEvents = cloneDeep(events)

    while (localEvents.length != 0) {
        const event = localEvents.pop()
        switch (event.kind) {
            case EventKind.BEFORE_TURN:
                const beforeTurnEvent = event as BeforeTurnEvent
                const beforeTurnResult = beforeTurnEvent.processBeforeTurn(ctx, newPartyStates)
                localEvents = localEvents.concat(beforeTurnResult.newEvents)
                newPartyStates = beforeTurnResult.newPartyStates
                break
            case EventKind.CANCEL_TURN:
                localEvents = []
                break
            case EventKind.START_TURN:
                const startTurnEvent = event as StartTurnEvent
                const startTurnResult = startTurnEvent.processStartTurn(ctx, newPartyStates)
                localEvents = localEvents.concat(startTurnResult.newEvents)
                newPartyStates = startTurnResult.newPartyStates
                break
            case EventKind.START_TURN_ITEM:
                const startTurnItemEvent = event as StartTurnItemEvent
                const startTurnItemResult = startTurnItemEvent.processStartTurnItem(ctx, newPartyStates)
                localEvents = localEvents.concat(startTurnItemResult.newEvents)
                newPartyStates = startTurnItemResult.newPartyStates
                break
            case EventKind.SELECT_TARGET:
                const selectTargetEvent = event as SelectTargetEvent
                const selectTargetResult = selectTargetEvent.processSelectTarget(ctx, newPartyStates)
                localEvents = localEvents.concat(selectTargetResult.newEvents)
                newPartyStates = selectTargetResult.newPartyStates
                break
            case EventKind.TARGET_FINALIZED:
                const targetFinalizedEvent = event as TargetFinalizedEvent
                const targetFinalizedResult = targetFinalizedEvent.processTargetFinalized(ctx, newPartyStates)
                localEvents = localEvents.concat(targetFinalizedResult.newEvents)
                newPartyStates = targetFinalizedResult.newPartyStates
                break
            case EventKind.BASIC_ATTACK:
                const basicAttackEvent = event as BasicAttackEvent
                const basicAttackResult = basicAttackEvent.processBasicAttack(ctx, newPartyStates)
                localEvents = localEvents.concat(basicAttackResult.newEvents)
                newPartyStates = basicAttackResult.newPartyStates
                break
            case EventKind.AFTER_ATTACK:
                const afterAttackEvent = event as AfterAttackEvent
                const afterAttackResult = afterAttackEvent.processAfterAttack(ctx, newPartyStates)
                localEvents = localEvents.concat(afterAttackResult.newEvents)
                newPartyStates = afterAttackResult.newPartyStates
                break
            case EventKind.SUMMON_ACTOR:
                const summonActorEvent = event as SummonActorEvent
                const summonActorResult = summonActorEvent.processSummonActor(ctx, newPartyStates)
                localEvents = localEvents.concat(summonActorResult.newEvents)
                newPartyStates = summonActorResult.newPartyStates
                break
            case EventKind.ACTOR_DIED:
                const actorDiedEvent = event as ActorDiedEvent
                const actorDiedResult = actorDiedEvent.processActorDied(ctx, newPartyStates)
                localEvents = localEvents.concat(actorDiedResult.newEvents)
                newPartyStates = actorDiedResult.newPartyStates
                break
            case EventKind.DAMAGE_TAKEN:
                const damageTakenEvent = event as DamageTakenEvent
                const damageTakenResult = damageTakenEvent.processDamageTaken(ctx, newPartyStates)
                localEvents = localEvents.concat(damageTakenResult.newEvents)
                newPartyStates = damageTakenResult.newPartyStates
                break
            case EventKind.DAMAGE_DEALT:
                const damageDealtEvent = event as DamageDealtEvent
                const damageDealtResult = damageDealtEvent.processDamageDealt(ctx, newPartyStates)
                localEvents = localEvents.concat(damageDealtResult.newEvents)
                newPartyStates = damageDealtResult.newPartyStates
                break
            case EventKind.HEALING_RECEIVED:
                const healingReceivedEvent = event as HealingReceivedEvent
                const healingReceivedResult = healingReceivedEvent.processHealingReceived(ctx, newPartyStates)
                localEvents = localEvents.concat(healingReceivedResult.newEvents)
                newPartyStates = healingReceivedResult.newPartyStates
                break
            case EventKind.END_TURN:
                const endTurnEvent = event as EndTurnEvent
                const endTurnResult = endTurnEvent.processEndTurn(ctx, newPartyStates)
                localEvents = localEvents.concat(endTurnResult.newEvents)
                newPartyStates = endTurnResult.newPartyStates
                break
            default:
                break
        }

        newPartyStates = newPartyStates.map((party, partyIndex) => 
            party.map((actor, actorIndex) => {
                if (actor.curHP <= 0 && !actor.dead) {
                    if (actor.angel) {
                        actor.angel = false
                        actor.curHP = Math.floor(actor.maxHP * 0.33)
                        ctx.logCombatMessage(`${actor.name} was ressurected!`)
                        return actor
                    }
                    
                    ctx.logCombatMessage(`${actor.name} has fallen!`)
                    // TODO: move these changes to the actor died event
                    actor.speed = 0             
                    actor.pitySpeed = 0       
                    actor.dead = true
                    localEvents = localEvents.concat(new ActorDiedEvent(actor, event as DamageTakenEvent))
                }
                return actor
            })
        )

        if (whichPartyDied(newPartyStates) !== null) {
            break
        }
    }

    return newPartyStates
}

type DetermineTurnResult = {
    partyID: number,
    partyIndex: number
}

function applyPitySpeed(ctx: DungeonContext, parties: Actor[][], turnResult: DetermineTurnResult): Actor[][] {
    let newPartyStates = cloneDeep(parties)

    return newPartyStates.map((party, partyIndex) => 
        party.map((actor, partyIndex) => {
            if (actor.curHP <= 0) return actor

            if (partyIndex === turnResult.partyID && partyIndex === turnResult.partyIndex) {
                actor.pitySpeed = 0
            } else {
                if (actor.pitySpeed === undefined) {
                    actor.pitySpeed = 0
                }
                actor.pitySpeed = actor.pitySpeed === undefined ? ctx.settings.pityScaling(actor.pitySpeed) : ctx.settings.pityScaling(0)
            }

            return actor
        })
    )
}

function determineTurn(party0: Actor[], party1: Actor[]): DetermineTurnResult {
    const allActors = party0.concat(party1)

    const totalSpeed = allActors
        .reduce((acc, cur) => 
            acc += Math.floor((cur.speed + (cur.pitySpeed ? cur.pitySpeed : 0)))
        ,0)
    
    const roll = getRandomInt(0, totalSpeed)
    let checkedSpeed = 0
    for (let i = 0; i < allActors.length; i++) {
        if (allActors[i].speed <= 0) continue

        let pitySpeed = allActors[i].pitySpeed ? allActors[i].pitySpeed : 0
        checkedSpeed += Math.floor(allActors[i].speed + pitySpeed)

        if (roll < checkedSpeed) {
            let partyID = 0
            let partyIndex = i

            if (i >= party0.length) {
                partyID = 1
                partyIndex -= party0.length
            }

            return {
                partyID, partyIndex
            }
        }
    }
}

export {
    Dungeon,
    startDungeon
}