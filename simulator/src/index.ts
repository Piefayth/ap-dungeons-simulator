import { Settings } from 'http2'
import { dungeon10 } from './dungeons/dungeon10'
import { dungeon2 } from './dungeons/dungeon2'
import { dungeon3 } from './dungeons/dungeon3'
import { dungeon4 } from './dungeons/dungeon4'
import { dungeon6 } from './dungeons/dungeon6'
import { dungeon7 } from './dungeons/dungeon7'
import { dungeon8 } from './dungeons/dungeon8'
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
                rej(error)
            })
        })

        promises.push(promise)
    }

    return Promise.allSettled(promises)
}

const testParty: Actor[] = [{
    name: "maurixxo",
    items: [new Avalanche(5), new MartyrArmor(5), new SurvivalKit(5), new MagicParasol(5)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 12,
    attackMin: 3,
    attackMax: 12
}, {
    name: "zoop",
    items: [new Avalanche(5), new MartyrArmor(5), new SurvivalKit(5), new MagicParasol(5)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 12,
    attackMin: 3,
    attackMax: 12
}/*, {
    name: "debuffer",
    items: [new Avalanche(5), new Freezeman(5), new Thorns(5), new LoveLetter(5)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 12,
    attackMin: 3,
    attackMax: 12
}, {
    name: "anotherguy",
    items: [new Avalanche(5), new Freezeman(5), new Thorns(5), new LoveLetter(5)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 12,
    attackMin: 3,
    attackMax: 12
}*/]

const testParty2: Actor[] = [{
    name: "piefayth",
    items: [new PetImp(6), new RockCompanion(5), new TrustySteed(5), new FestiveFeast(5)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 13,
    attackMin: 3,
    attackMax: 12
}, {
    name: "saki",
    items: [new ExplosionPowder(3), new TrustySteed(3), new DrainingDagger(2), new Freezeman(3)],
    auras: [],
    maxHP: 110,
    curHP: 110,
    energy: 0,
    speed: 11,
    attackMin: 1,
    attackMax: 10
}, {
    name: "Tobi",
    items: [new PetImp(3), new RockCompanion(3), new SeekingMissiles(3), new Avalanche(3)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 12,
    attackMin: 2,
    attackMax: 11
}]

const testParty3: Actor[] = [{
    name: "zoop",
    items: [new HealingPendant(6), new RockCompanion(6), new TrustySteed(6), new FestiveFeast(6)],
    auras: [],
    maxHP: 140,
    curHP: 140,
    energy: 0,
    speed: 13,
    attackMin: 4,
    attackMax: 13
}, {
    name: "piefayth",
    items: [new SurvivalKit(6), new RockCompanion(6), new TrustySteed(6), new FestiveFeast(6)],
    auras: [],
    maxHP: 140,
    curHP: 140,
    energy: 0,
    speed: 13,
    attackMin: 3,
    attackMax: 12
}, {
    name: "rando",
    items: [new PetImp(5), new RockCompanion(5), new TrustySteed(6), new ImpWhistle(5)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 13,
    attackMin: 3,
    attackMax: 12
}]

if (require.main === module && typeof window == "undefined") {
    const selectedParty = testParty3
    const selectedDungeon = dungeon7
    const trials = 100
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
                        item1: `${actor.items[0].kind} ${actor.items[0].tier}`,
                        item2: `${actor.items[1].kind} ${actor.items[1].tier}`,
                        item3: `${actor.items[2].kind} ${actor.items[2].tier}`,
                        item4: `${actor.items[3].kind} ${actor.items[3].tier}`
                    }
                })

                console.log(`Ran Dungeon ${selectedDungeon.tier} with this party:`)
                console.table(partyTable)
                console.log(`Winrate: ${(aggregateResult.wins / aggregateResult.trials) * 100}%`)
            })
            .catch(failed => console.log('failed???'))
    } else {
        const simulator = new DungeonSimulator({
            displayCombatEvents: false,
            displayPartyStates: false,
            pityScaling: (speed) => speed + 0
        })
        simulator.simulate(trials, selectedParty, selectedDungeon)
    }
}