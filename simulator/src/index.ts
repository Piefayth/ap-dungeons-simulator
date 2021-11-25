import { Settings } from 'http2'
import { dungeon10 } from './dungeons/dungeon10'
import { dungeon2 } from './dungeons/dungeon2'
import { dungeon3 } from './dungeons/dungeon3'
import { dungeon4 } from './dungeons/dungeon4'
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
import { DungeonSimulator } from './simulator'

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
    name: "zoop",
    items: [new MartyrArmor(7), new SurvivalKit(7), new MagicParasol(7), new BoostingBugle(7)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 13,
    attackMin: 4,
    attackMax: 13
}, {
    name: "piefayth",
    items: [new MartyrArmor(7), new SurvivalKit(7), new MagicParasol(7), new BoostingBugle(7)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 13,
    attackMin: 3,
    attackMax: 12
}, {
    name: "birb",
    items: [new MartyrArmor(7), new SurvivalKit(7), new MagicParasol(7), new BoostingBugle(7)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 13,
    attackMin: 3,
    attackMax: 12
}]

const testParty3: Actor[] = [{
    name: "zoop",
    items: [new PetImp(4), new RockCompanion(5), new TrustySteed(4), new ImpWhistle(3)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 13,
    attackMin: 4,
    attackMax: 13
}, {
    name: "piefayth",
    items: [new PetImp(4), new RockCompanion(4), new TrustySteed(3), new FestiveFeast(5)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 13,
    attackMin: 3,
    attackMax: 12
}]

async function worker() {
    const req = module[`require`].bind(module)
    const { Worker } = req('worker_threads')

    const worker = new Worker('./simulator/src/worker-import.js', {
        workerData: {
            trials: 10,
            party: testParty3,
            dungeon: dungeon4,
            path: './worker.ts'
        }
    })

    const promise = new Promise((res, rej) => {
        worker.on('message', (result) => {
            res(result)
        })

        worker.on('error', (error) => {
            rej(error)
        })
    })

    return promise
}

if (require.main === module && typeof window == "undefined") {
    const workerOption = process.argv[2]
    if (workerOption) {
        worker()
    } else {
        const simulator = new DungeonSimulator({
            displayCombatEvents: false,
            displayPartyStates: false,
            pityScaling: (speed) => speed + 0
        })
        simulator.simulate(10, testParty2, dungeon7)
    }
}