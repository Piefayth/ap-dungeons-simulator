import { Actor } from "../actor"
import { CombatEvent, Event, EventKind, ProcessedEventResult } from "../events"
import { getRandomInt } from "../../util/math"
import { BasicAttackEvent } from "./basicAttack"
import { EndTurnEvent } from "./endTurn"
import { DungeonContext } from "../../simulator"
import { ActorDiedEvent } from "./actorDied"

class CheckDeathsEvent extends Event {
    constructor() {
        super(EventKind.CHECK_DEATHS)
    }

    processCheckDeaths(ctx: DungeonContext, parties: Actor[][]): ProcessedEventResult {
        return checkDeaths(ctx, parties)
    }
}

function checkDeaths(ctx: DungeonContext, parties: Actor[][]): ProcessedEventResult {
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
                
                ctx.logCombatMessage(`${actor.name} has fallen!`)
                events.push(new ActorDiedEvent(actor, partyIndex, actorIndex))
            }
        return actor
    }))

    return {
        newPartyStates: parties,
        newEvents: events,
    }
}

export {
    CheckDeathsEvent,
    checkDeaths
}