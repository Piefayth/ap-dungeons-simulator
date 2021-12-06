import { Actor } from "../actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../events"
import { getRandomInt } from "../../util/math"
import { BasicAttackEvent } from "./basicAttack"
import { EndTurnEvent } from "./endTurn"
import { DungeonContext } from "../../simulator"
import { ActorDiedEvent } from "./actorDied"
import { whichPartyDied } from "../dungeon"
import { CancelTurnEvent } from "./cancelTurn"

class CheckDeathsEvent extends Event {
    turnActorPartyIndex: number
    turnActorIndex: number

    constructor(turnActorPartyIndex: number, turnActorIndex: number) {
        super(EventKind.CHECK_DEATHS)
        this.turnActorPartyIndex = turnActorPartyIndex
        this.turnActorIndex = turnActorIndex
    }

    processCheckDeaths(ctx: DungeonContext, parties: Actor[][]): ProcessedEventResult {
        return checkDeaths(ctx, parties, this.turnActorPartyIndex, this.turnActorIndex)
    }
}

function checkDeaths(ctx: DungeonContext, parties: Actor[][], turnActorPartyIndex: number, turnActorIndex: number): ProcessedEventResult {
    let events = []
    
    parties = parties.map((party, partyIndex) => party
        .map((actor, actorIndex) => {
            if (actor && actor.curHP <= 0 && !actor.dead) {
                if (actor.angel) {
                    actor.angel = false
                    actor.curHP = Math.floor(actor.maxHP * 0.33)
                    ctx.logCombatMessage(`${actor.name} was ressurected!`)
                    return actor
                }
                
                actor.speed = 0             
                actor.pitySpeed = 0       
                actor.dead = true

                ctx.logCombatMessage(`${actor.name} has fallen!`)

                // if you die on your own turn, process it last, because it will 
                // cancel the remainder of the turn, despite other deaths possibly occuring
                if (turnActorPartyIndex == actorIndex) {
                    events.unshift(new ActorDiedEvent(actor, partyIndex, actorIndex, turnActorPartyIndex, turnActorIndex))
                } else {
                    events.push(new ActorDiedEvent(actor, partyIndex, actorIndex, turnActorPartyIndex, turnActorIndex))
                }
            }
            return actor
    }))

    let deadParty = whichPartyDied(parties)
    if (deadParty !== null) {
        events.push(new CancelTurnEvent())
    }

    return {
        newPartyStates: parties,
        newEvents: events,
    }
}

export {
    CheckDeathsEvent,
    checkDeaths
}