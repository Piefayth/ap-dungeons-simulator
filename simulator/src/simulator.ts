import { Actor } from "./engine/actor"
import { Dungeon, startDungeon } from "./engine/dungeon"
import { Settings } from "./settings"

export type SimulationResult = {
    trials: number
    wins: number
    losses: number
    winrate: number
    party: Actor[]
    results: DungeonResult[]        // [trial]
}

export type DungeonResult = {
    turnPartyStates: Actor[][][],   // [turn][parties][party]
    turnOutput: string[][]          // [turn][messages]
}

export class DungeonContext {
    settings: Settings
    simulationResult: SimulationResult
    currentTrial: number
    currentTurn: number

    constructor(settings: Settings) {
        this.settings = settings
        this.simulationResult = {
            trials: 0,
            wins: 0,
            losses: 0,
            winrate: 0,
            results: [],
            party: []
        }
        this.currentTrial = 0
        this.currentTurn = 0
        this.simulationResult.results[this.currentTrial] = {
            turnPartyStates: [[[]]],
            turnOutput: [[]]
        }
    }

    logPartyStates(parties: Actor[][]) {
        if (!this.settings.skipHistoryStorage) {
            this.simulationResult.results[this.currentTrial].turnPartyStates[this.currentTurn] = parties.map(party => party.map(actor => ({ ...actor })))
        }
    }

    logCombatMessage(message: string) {
        if (this.settings.displayCombatEvents) {
            console.log(message)
        }

        if (!this.settings.skipHistoryStorage) {
            this.simulationResult.results[this.currentTrial].turnOutput[this.currentTurn].push(message)
        }
    }

    endTrial() {
        this.simulationResult.results[this.currentTrial].turnOutput.pop()

        this.currentTrial++
        this.currentTurn = 0
        
        this.simulationResult.results[this.currentTrial] = {
            turnPartyStates: [[[]]],
            turnOutput: [[]]
        }
    }

    endTurn() {
        this.currentTurn++
        this.simulationResult.results[this.currentTrial].turnOutput[this.currentTurn] = []
    }

    endSimulation() {
        this.simulationResult.results.pop()
    }
}

export class DungeonSimulator {
    settings: Settings

    constructor(settings: Settings) {
        this.settings = settings
    }

    simulate(trials: number, party: Actor[], dungeon: Dungeon): SimulationResult {
        let wins = 0
        let ctx = new DungeonContext(this.settings)
        ctx.simulationResult.party = party
        
        for (let i = 0; i < trials; i++) {
            console.log(`Running trial ${i} / ${trials}`)
            const trialResult = startDungeon(ctx, dungeon, party)

            ctx.endTrial()
            ctx.simulationResult.trials++

            if (trialResult.won) {
                ctx.simulationResult.wins++
            } else {
                ctx.simulationResult.losses++
            }

            if (i + 1 === trials) {
                ctx.endSimulation()
            }
        }

        console.log(`In ${trials} trials:`)
        console.log(`Wins: ${ctx.simulationResult.wins}`)
        console.log(`Losses: ${trials - ctx.simulationResult.wins}`)
        console.log(`Winrate: ${(ctx.simulationResult.wins / trials) * 100}%`)
        console.log(`Average Turns Taken: ${ctx.simulationResult.results.reduce((acc, result) => {
            return acc += result.turnOutput.length
        }, 0) / trials }`)

        return ctx.simulationResult
    }

    simulateSingle(party: Actor[], dungeon: Dungeon): SimulationResult {
        let ctx = new DungeonContext(this.settings)
        ctx.simulationResult.party = party

        const trialResult = startDungeon(ctx, dungeon, party)

        ctx.simulationResult.trials++
        if (trialResult.won) {
            ctx.simulationResult.wins++
        } else {
            ctx.simulationResult.losses++
        }

        return ctx.simulationResult
    }
}