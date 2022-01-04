import { dungeon1 } from './dungeons/dungeon1'
import { dungeon10 } from './dungeons/dungeon10'
import { dungeon11 } from './dungeons/dungeon11'
import { dungeon2 } from './dungeons/dungeon2'
import { dungeon3 } from './dungeons/dungeon3'
import { dungeon4 } from './dungeons/dungeon4'
import { dungeon5 } from './dungeons/dungeon5'
import { dungeon6 } from './dungeons/dungeon6'
import { dungeon7 } from './dungeons/dungeon7'
import { dungeon9 } from './dungeons/dungeon9'
import { Actor } from './engine/actor'
import { Dungeon, startDungeon } from './engine/dungeon'
import { ItemKind } from './engine/itemTypes'
import { FestiveFeast, TrustySteed } from './items'
import { Avalanche } from './items/avalanche'
import { BFCannon } from './items/bfCannon'
import { BigClub } from './items/bigClub'
import { BoostingBugle } from './items/boostingBugle'
import { ChallengerArrow } from './items/challengerArrow'
import { ChumbyChicken } from './items/chicken'
import { CleansedTome } from './items/cleansedTome'
import { CleansingFlames } from './items/cleansingFlames'
import { DrainingDagger } from './items/drainingDagger'
import { EnergeticAlly } from './items/energeticAlly'
import { ExplosionPowder } from './items/explosionPowder'
import { FireSword } from './items/fireSword'
import { Freezeman } from './items/freezeman'
import { Halberd } from './items/halberd'
import { HealingPendant } from './items/healingPendant'
import { ImpWhistle } from './items/impWhistle'
import { KnightsLance } from './items/knightsLance'
import { LoveLetter } from './items/loveLetter'
import { Machete } from './items/machete'
import { MagicParasol } from './items/magicParasol'
import { MartyrArmor } from './items/martyrArmor'
import { PetImp } from './items/petImp'
import { PoisonDagger } from './items/poisonDagger'
import { RockCompanion } from './items/rockCompanion'
import { RoughSkin } from './items/roughSkin'
import { SeekingMissiles } from './items/seekingMissiles'
import { SurvivalKit } from './items/survivalKit'
import { Thorns } from './items/thorns'
import { WhirlwindAxe } from './items/whirlwindAxe'
import { DungeonResult, DungeonSimulator, SimulationResult } from './simulator'

async function worker(numTrials: number, numWorkers: number, party: Actor[], dungeon: Dungeon) {
    const req = module[`require`].bind(module)
    const { Worker } = req('worker_threads')

    let extraTrials = numTrials % numWorkers
    let trialsPerWorker = Math.floor(numTrials / numWorkers)

    let promises = []
    let totalTrialsCompleted = 0

    for (let i = 0; i < numWorkers; i++) {
        let localTrials = trialsPerWorker

        if (i === 0) {
            localTrials += extraTrials // TODO: distribute the extras better
        }

        const worker = new Worker('./simulator/src/worker-import.js', {
            workerData: {
                trials: localTrials,
                party: party,
                dungeon: dungeon,
                path: './worker.ts'
            }
        })

        const promise = new Promise((res, rej) => {
            let count = 0
            let dungeonResults: SimulationResult[] = []
            
            worker.on('message', (result) => {
                totalTrialsCompleted++
                count++

                process.stdout.moveCursor(0, -1) 
                process.stdout.clearLine(1) 
                console.log(`Completed ${totalTrialsCompleted} trials`)

                dungeonResults.push(result)
                
                if (count >= localTrials) {
                    res(dungeonResults)
                }
            })
    
            worker.on('error', (error) => {
                console.log(`worker ${i} errored a run`)
                console.log(error)
                rej(error)
            })
        })

        promises.push(promise)
    }

    return Promise.allSettled(promises)
}

const testParty: Actor[] = [{
    name: "zoop",
    items: [new BigClub(9), new DrainingDagger(9), new Freezeman(9), new ChallengerArrow(9)],
    auras: [],
    maxHP: 155,
    curHP: 155,
    energy: 0,
    speed: 15,
    attackMin: 4,
    attackMax: 13,
}, {
    name: "pie",
    items: [new ChumbyChicken(9), new DrainingDagger(9), new TrustySteed(9), new BoostingBugle(9)],
    auras: [],
    maxHP: 155,
    curHP: 155,
    energy: 0,
    speed: 15,
    attackMin: 4,
    attackMax: 13,
}, {
    name: "pockees",
    items: [new SurvivalKit(9), new DrainingDagger(8), new TrustySteed(9), new FestiveFeast(9)],
    auras: [],
    maxHP: 150,
    curHP: 150,
    energy: 0,
    speed: 14,
    attackMin: 1,
    attackMax: 10,
}, {
    name: "tobu",
    items: [new DrainingDagger(9), new SurvivalKit(9), new TrustySteed(8), new BoostingBugle(9)],
    auras: [],
    maxHP: 155,
    curHP: 155,
    energy: 0,
    speed: 15,
    attackMin: 4,
    attackMax: 13,
}, {
    name: "pockees2",
    items: [new SurvivalKit(8), new DrainingDagger(9), new Freezeman(8), new Avalanche(9)],
    auras: [],
    maxHP: 150,
    curHP: 150,
    energy: 0,
    speed: 14,
    attackMin: 1,
    attackMax: 10,
}]

const testParty2: Actor[] = [{
    name: "zoop",
    items: [new BigClub(9), new DrainingDagger(9), new Freezeman(9), new ChallengerArrow(9)],
    auras: [],
    maxHP: 155,
    curHP: 155,
    energy: 0,
    speed: 15,
    attackMin: 4,
    attackMax: 13,
}, {
    name: "pie",
    items: [new SurvivalKit(9), new DrainingDagger(8), new TrustySteed(8), new BoostingBugle(9)],
    auras: [],
    maxHP: 155,
    curHP: 155,
    energy: 0,
    speed: 15,
    attackMin: 4,
    attackMax: 13,
}, {
    name: "tymp",
    items: [new SurvivalKit(8), new DrainingDagger(8), new HealingPendant(9), new BoostingBugle(9)],
    auras: [],
    maxHP: 140,
    curHP: 140,
    energy: 0,
    speed: 13,
    attackMin: 2,
    attackMax: 11,
}, {
    name: "pockees",
    items: [new SurvivalKit(9), new DrainingDagger(8), new TrustySteed(9), new FestiveFeast(9)],
    auras: [],
    maxHP: 150,
    curHP: 150,
    energy: 0,
    speed: 14,
    attackMin: 1,
    attackMax: 10,
}]


const testParty3: Actor[] = [{
    name: "zoop",
    items: [new BigClub(6), new SeekingMissiles(6), new Freezeman(6), new ChallengerArrow(6)],
    auras: [],
    maxHP: 155,
    curHP: 155,
    energy: 0,
    speed: 16,
    attackMin: 4,
    attackMax: 13,
}, {
    name: "tymp",
    items: [new BigClub(6), new SeekingMissiles(6), new Freezeman(6), new ChallengerArrow(6)],
    auras: [],
    maxHP: 140,
    curHP: 140,
    energy: 0,
    speed: 14,
    attackMin: 4,
    attackMax: 13,
}, {
    name: "pie",
    items: [new SurvivalKit(6), new DrainingDagger(6), new MagicParasol(6), new BoostingBugle(6)],
    auras: [],
    maxHP: 155,
    curHP: 155,
    energy: 0,
    speed: 16,
    attackMin: 4,
    attackMax: 13,
}, {
    name: "pockees",
    items: [new SurvivalKit(6), new DrainingDagger(6), new MagicParasol(6), new BoostingBugle(6)],
    auras: [],
    maxHP: 150,
    curHP: 150,
    energy: 0,
    speed: 15,
    attackMin: 1,
    attackMax: 10,
}]


if (require.main === module && typeof window == "undefined") {
    const selectedParty = testParty3
    const selectedDungeon = dungeon8
    const trials = 20000
    const workers = 4
    const workerOption = process.argv[2]

    if (workerOption) {
        worker(trials, workers, selectedParty, selectedDungeon)
            .then((results: PromiseSettledResult<SimulationResult[]>[]) => {
                const aggregateResult = results.reduce((acc: SimulationResult, cur: PromiseSettledResult<SimulationResult[]>, index: number) => {
                    if (cur.status === "fulfilled") {
                        let fulfilled = cur as PromiseFulfilledResult<SimulationResult[]>
                        fulfilled.value.forEach(result => {
                            acc.wins += result.wins
                            acc.losses += result.losses
                            acc.trials += result.trials
                        })
                    }

                    return acc
                }, {
                    trials: 0,
                    wins: 0,
                    losses: 0,
                    winrate: 0,
                    party: [],
                    results: []
                })

                const partyTable = selectedParty.map(actor => {
                    return {
                        name: actor.name,
                        item1: actor.items[0] ? `${actor.items[0].kind} ${actor.items[0].tier}` : 'NONE',
                        item2: actor.items[1] ? `${actor.items[1].kind} ${actor.items[1].tier}` : 'NONE',
                        item3: actor.items[2] ? `${actor.items[2].kind} ${actor.items[2].tier}` : 'NONE',
                        item4: actor.items[3] ? `${actor.items[3].kind} ${actor.items[3].tier}` : 'NONE',
                        angel: actor.angel ? 'Y' : 'N'
                    }
                })

                console.log(`Ran Dungeon ${selectedDungeon.tier} with this party:`)
                console.table(partyTable)
                console.log(`Winrate: ${(aggregateResult.wins / aggregateResult.trials) * 100}%`)
            })
            .catch(failed => console.log(failed))
    } else {
        const simulator = new DungeonSimulator({
            displayCombatEvents: true,
            displayPartyStates: false,
            pityScaling: (speed, pitySpeed) => pitySpeed + 0
        })
        simulator.simulate(trials, selectedParty, selectedDungeon)
    }
}