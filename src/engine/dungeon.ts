import { getRandomInt } from '../util/math'
import { Actor } from './actor'
import { 
    Event, 
    EventKind, 
} from './events'
import { BasicAttackEventData, generateBasicAttack, processBasicAttack } from './events/basicAttack'
import { BigClubEventData, processBigClubEvent } from './events/bigClub'
import { SummonChickenEventData, processSummonChickenEvent, generateChickenDiedEvent, processChickenDiedEvent, ChickenDiedEventData } from './events/chumbyChicken'
import { DamageTakenEventData, processDamageTaken } from './events/damageTaken'
import { HealingReceivedEventData, processHealingReceived } from './events/healingReceived'
import { MacheteAttackEventData, processMacheteAttack } from './events/machete'
import { itemEnergyCosts, itemEventGenerators } from './item'
import * as _ from 'lodash'

type Floor = {
    enemies: Actor[]
}

type Dungeon = {
    tier: number,
    floors: Floor[]
}

function startDungeon(dungeon: Dungeon, party: Actor[]) {
    const party0 = _.cloneDeep(party)
    const party1 = _.cloneDeep(dungeon.floors[0].enemies)
    
    for (let i = 0; i < dungeon.floors.length; i++) {
        console.log(`Starting floor ${i}`)

        // TODO: Call function to remove chicken exhaustion
        // probably want to have "floor begin" and "floor end" events?

        const losingParty = simulateFloor([party0, party1])
        if (losingParty == 0) {
            console.log(`Party 0 has fallen!`)
            return
        }
    }

    console.log(`Party 1 has fallen!`)
}

function simulateFloor(parties: Actor[][]): number {
    let deadParty = whichPartyDied(parties)
    if (deadParty !== null) {
        return deadParty
    }

    console.log('--------')
    const turnActorSelection = determineTurn(parties[0], parties[1])

    // TODO: Make energy happen before turn
    // const beforeTurnResult = prepareTurn(attackingParty, defendingParty)

    // implement a stat item (freezeman, halberd)
    // implement energy
    // implement an energy item

    const turnEvents = generateTurnEvents(parties, turnActorSelection.partyID, turnActorSelection.partyIndex)
    const newPartyState = processTurnEvents(parties, turnEvents)

    return simulateFloor(newPartyState)
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
            case EventKind.BASIC_ATTACK:
                const basicAttackResult = processBasicAttack(newPartyStates, event as Event<BasicAttackEventData>)
                localEvents = localEvents.concat(basicAttackResult.newEvents)
                newPartyStates = basicAttackResult.newPartyStates
                break
            case EventKind.BIG_CLUB:
                newPartyStates = processBigClubEvent(newPartyStates, event as Event<BigClubEventData>)
                break
            case EventKind.SUMMON_CHUMBY_CHICKEN:
                newPartyStates = processSummonChickenEvent(newPartyStates, event as Event<SummonChickenEventData>)
                break
            case EventKind.CHICKEN_DIED:
                const chickenDiedResult = processChickenDiedEvent(newPartyStates, event as Event<ChickenDiedEventData>)
                newPartyStates = chickenDiedResult.newPartyStates
                localEvents = localEvents.concat(chickenDiedResult.newEvents)
                break
            case EventKind.MACHETE_ATTACK:
                localEvents = localEvents.concat(
                    processMacheteAttack(newPartyStates, event as Event<MacheteAttackEventData>)
                )
                break
            case EventKind.DAMAGE_TAKEN:
                newPartyStates = processDamageTaken(newPartyStates, event as Event<DamageTakenEventData>)
                break
            case EventKind.HEALING_RECEIVED:
                newPartyStates = processHealingReceived(newPartyStates, event as Event<HealingReceivedEventData>)
                break
            default:
                break
        }

        // remove dead units
        // this could be an event
        newPartyStates = newPartyStates.map((party, partyIndex) => 
            party.filter(actor => {
                if (actor.curHP <= 0) {
                    console.log(`${actor.name} has fallen!`)                    
                    if (actor.name.includes(`Celine's Chumby Chicken`)) {
                        localEvents = localEvents.concat(generateChickenDiedEvent(newPartyStates, partyIndex, actor, event))
                    }
                    return false
                }
                return true
            })
        )
    }

    return newPartyStates
}

function generateTurnEvents(parties, attackerPartyIndex, attackerIndex): Event[] {
    let events = []

    const basicAttackEvent = generateBasicAttack(parties, attackerPartyIndex, attackerIndex)[0]
    events = events.concat(basicAttackEvent)

    let attacker = parties[attackerPartyIndex][attackerIndex]
    for (let i = 0; i < attacker.items.length; i++) {
        if (itemEnergyCosts[attacker.items[i].kind] <= attacker.energy) {
            const itemEvent = itemEventGenerators[attacker.items[i].kind](
                parties, attackerPartyIndex, attackerIndex, basicAttackEvent
            )
            events = events.concat(itemEvent)
        }
    }
    
    return events
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