import * as _ from 'lodash'
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
import { combatMessage } from '../log'
import { DamageTakenEvent } from './events/damageTaken'
import settings from '../settings'

type Floor = {
    enemies: Actor[]
}

type Dungeon = {
    tier: number,
    floors: Floor[]
}

let turnCounter = 0

function startDungeon(dungeon: Dungeon, party: Actor[]): boolean {
    let parties = _.cloneDeep([party, []])
    
    // TODO: Move dungeon start and floor start to events
    // Without this, can't use summon actor event for pet summons

    for (let i = 0; i < parties.length; i++) {
        for (let j = 0; j < parties[i].length; j++) {
            for (let k = 0; k < parties[i][j].items.length; k++) {
                let result = parties[i][j].items[k].handleOnDungeonStart(parties, i, j)
                parties = result.newPartyStates
            }
        }
    }

    for (let f = 0; f < dungeon.floors.length; f++) {
        combatMessage(`Starting floor ${f}`)
        parties[1] = _.cloneDeep(dungeon.floors[f].enemies)
        
        // handle new floor actions for items
        for (let i = 0; i < parties.length; i++) {
            for (let j = 0; j < parties[i].length; j++) {
                for (let k = 0; k < parties[i][j].items.length; k++) {
                    let result = parties[i][j].items[k].handleNewFloor(parties, i, j, f)
                    parties = result.newPartyStates
                }
            }
        }

        turnCounter = 0
        parties = simulateFloor(parties)
        
        if (whichPartyDied(parties) == 0) {
            return false
        }
    }

    return true
}



function simulateFloor(parties: Actor[][]): Actor[][] {
    let deadParty = whichPartyDied(parties)
    if (deadParty !== null) {
        return parties
    }

    combatMessage('--------')
    
    if (settings.displayPartyStates) {
        console.log(JSON.stringify(parties, null, 2))
    }

    const turnActorSelection = determineTurn(parties[0], parties[1])
    let newPartyState = prepareTurn(parties)
    const startTurnEvent = new StartTurnEvent(turnActorSelection.partyID, turnActorSelection.partyIndex)
    newPartyState = processTurnEvents(newPartyState, [startTurnEvent])

    turnCounter++
    if (turnCounter > 1000) {
        console.log(JSON.stringify(newPartyState, null, 2))
        throw new Error("combat looped infinitely - printing party state")
    }
    
    return simulateFloor(newPartyState)
}

function prepareTurn(parties: Actor[][]): Actor[][] {
    let newPartyState = _.cloneDeep(parties)

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

function processTurnEvents(parties: Actor[][], events: Event[]): Actor[][] {
    let newPartyStates = _.cloneDeep(parties)
    let localEvents = _.cloneDeep(events)

    while (localEvents.length != 0) {
        const event = localEvents.pop()
        switch (event.kind) {
            case EventKind.START_TURN:
                const startTurnEvent = event as StartTurnEvent
                const startTurnResult = startTurnEvent.processStartTurn(newPartyStates)
                localEvents = localEvents.concat(startTurnResult.newEvents)
                newPartyStates = startTurnResult.newPartyStates
                break
            case EventKind.START_TURN_ITEM:
                const startTurnItemEvent = event as StartTurnItemEvent
                const startTurnItemResult = startTurnItemEvent.processStartTurnItem(newPartyStates)
                localEvents = localEvents.concat(startTurnItemResult.newEvents)
                newPartyStates = startTurnItemResult.newPartyStates
                break
            case EventKind.SELECT_TARGET:
                const selectTargetEvent = event as SelectTargetEvent
                const selectTargetResult = selectTargetEvent.processSelectTarget(newPartyStates)
                localEvents = localEvents.concat(selectTargetResult.newEvents)
                newPartyStates = selectTargetResult.newPartyStates
                break
            case EventKind.TARGET_FINALIZED:
                const targetFinalizedEvent = event as TargetFinalizedEvent
                const targetFinalizedResult = targetFinalizedEvent.processTargetFinalized(newPartyStates)
                localEvents = localEvents.concat(targetFinalizedResult.newEvents)
                newPartyStates = targetFinalizedResult.newPartyStates
                break
            case EventKind.BASIC_ATTACK:
                const basicAttackEvent = event as BasicAttackEvent
                const basicAttackResult = basicAttackEvent.processBasicAttack(newPartyStates)
                localEvents = localEvents.concat(basicAttackResult.newEvents)
                newPartyStates = basicAttackResult.newPartyStates
                break
            case EventKind.AFTER_ATTACK:
                const afterAttackEvent = event as AfterAttackEvent
                const afterAttackResult = afterAttackEvent.processAfterAttack(newPartyStates)
                localEvents = localEvents.concat(afterAttackResult.newEvents)
                newPartyStates = afterAttackResult.newPartyStates
                break
            case EventKind.SUMMON_ACTOR:
                const summonActorEvent = event as SummonActorEvent
                const summonActorResult = summonActorEvent.processSummonActor(newPartyStates)
                localEvents = localEvents.concat(summonActorResult.newEvents)
                newPartyStates = summonActorResult.newPartyStates
                break
            case EventKind.ACTOR_DIED:
                const actorDiedEvent = event as ActorDiedEvent
                const actorDiedResult = actorDiedEvent.processActorDied(newPartyStates)
                localEvents = localEvents.concat(actorDiedResult.newEvents)
                newPartyStates = actorDiedResult.newPartyStates
                break
            case EventKind.DAMAGE_TAKEN:
                const damageTakenEvent = event as DamageTakenEvent
                const damageTakenResult = damageTakenEvent.processDamageTaken(newPartyStates)
                localEvents = localEvents.concat(damageTakenResult.newEvents)
                newPartyStates = damageTakenResult.newPartyStates
                break
            case EventKind.DAMAGE_DEALT:
                const damageDealtEvent = event as DamageDealtEvent
                const damageDealtResult = damageDealtEvent.processDamageDealt(newPartyStates)
                localEvents = localEvents.concat(damageDealtResult.newEvents)
                newPartyStates = damageDealtResult.newPartyStates
                break
            case EventKind.HEALING_RECEIVED:
                const healingReceivedEvent = event as HealingReceivedEvent
                const healingReceivedResult = healingReceivedEvent.processHealingReceived(newPartyStates)
                localEvents = localEvents.concat(healingReceivedResult.newEvents)
                newPartyStates = healingReceivedResult.newPartyStates
                break
            case EventKind.END_TURN:
                const endTurnEvent = event as EndTurnEvent
                const endTurnResult = endTurnEvent.processEndTurn(newPartyStates)
                localEvents = localEvents.concat(endTurnResult.newEvents)
                newPartyStates = endTurnResult.newPartyStates
                break
            default:
                break
        }

        newPartyStates = newPartyStates.map((party, partyIndex) => 
            party.map((actor, actorIndex) => {
                if (actor.curHP <= 0 && !actor.dead) {
                    combatMessage(`${actor.name} has fallen!`)
                    actor.speed = 0                    
                    actor.dead = true
                    localEvents = localEvents.concat(new ActorDiedEvent(actor, event as CombatEvent))
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

function determineTurn(party0: Actor[], party1: Actor[]): DetermineTurnResult {
    const allActors = party0.concat(party1)

    const totalSpeed = allActors
        .reduce((acc, cur) => 
            acc += cur.speed
        ,0)
    
    const roll = getRandomInt(0, totalSpeed)
    let checkedSpeed = 0
    for (let i = 0; i < allActors.length; i++) {
        if (allActors[i].speed <= 0) continue

        checkedSpeed += allActors[i].speed
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