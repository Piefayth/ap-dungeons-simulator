import { Actor } from './engine/actor'
import { Dungeon, startDungeon } from './engine/dungeon'
import { ItemKind } from './engine/itemTypes'
import { Avalanche } from './items/avalanche'
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
import { SeekingMissiles } from './items/seekingMissiles'
import { SurvivalKit } from './items/survivalKit'
import { Thorns } from './items/thorns'
import { WhirlwindAxe } from './items/whirlwindAxe'

const fruxParty: Actor[] = [{
    name: "Frux",
    items: [new BoostingBugle(8), new MartyrArmor(7), new Freezeman(7), new PoisonDagger(7)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 12,
    attackMin: 3,
    attackMax: 12
}, {
    name: "Tobu",
    items: [new EnergeticAlly(8), new MartyrArmor(8), new MagicParasol(7), new SurvivalKit(7)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 12,
    attackMin: 3,
    attackMax: 12
}]


const zoopParty: Actor[] = [{
    name: "maurixxo",
    items: [new ChallengerArrow(8), new FireSword(8), new Freezeman(7), new BigClub(7)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 12,
    attackMin: 3,
    attackMax: 12
}, {
    name: "zoop",
    items: [new MagicParasol(8), new MartyrArmor(8), new KnightsLance(7), new SurvivalKit(7)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 12,
    attackMin: 3,
    attackMax: 12
}, {
    name: "neonus",
    items: [new CleansingFlames(7), new EnergeticAlly(7), new Freezeman(7), new LoveLetter(7)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 12,
    attackMin: 3,
    attackMax: 12
}]


const dungeon8: Dungeon = {
    tier: 8,
    floors: [{
        enemies: [{
            name: "Boomerang Monkey",
            items: [new Machete(8)],
            auras: [],
            maxHP: 225,
            curHP: 225,
            energy: 0,
            speed: 17,
            attackMin: 24,
            attackMax: 32
        }, {
            name: "Wizard Monkey",
            items: [new ExplosionPowder(2)],
            auras: [],
            maxHP: 250,
            curHP: 250,
            energy: 999,
            speed: 10,
            attackMin: 0,
            attackMax: 0
        }, {
            name: "Ice Monkey",
            items: [new Avalanche(1)],
            auras: [],
            maxHP: 200,
            curHP: 200,
            energy: 999,
            speed: 10,
            attackMin: 10,
            attackMax: 25
        }]
    }, {
        enemies: [{
            name: "Dart Monkey 1",
            items: [],
            auras: [],
            maxHP: 150,
            curHP: 150,
            energy: 0,
            speed: 18,
            attackMin: 10,
            attackMax: 40
        }, {
            name: "Dart Monkey 2",
            items: [],
            auras: [],
            maxHP: 150,
            curHP: 150,
            energy: 0,
            speed: 18,
            attackMin: 10,
            attackMax: 40
        }, {
            name: "Tack Shooter 1",
            items: [new Thorns(7)],
            auras: [],
            maxHP: 200,
            curHP: 200,
            energy: 0,
            speed: 18,
            attackMin: 0,
            attackMax: 0
        }, {
            name: "Tack Shooter 2",
            items: [new Thorns(7)],
            auras: [],
            maxHP: 200,
            curHP: 200,
            energy: 0,
            speed: 18,
            attackMin: 0,
            attackMax: 0
        }]
    }, {
        enemies: [{
            name: "Super Monkey",
            items: [new SeekingMissiles(2)],
            auras: [],
            maxHP: 375,
            curHP: 375,
            energy: 0,
            speed: 55,
            attackMin: 20,
            attackMax: 35
        }, {
            name: "Monkey Village",
            items: [new BoostingBugle(3)],
            auras: [],
            maxHP: 200,
            curHP: 200,
            energy: 1001,
            speed: 20,
            attackMin: 0,
            attackMax: 0
        }]
    }]
}

let trials = 1000
let wins = 0

for (let i = 0; i < trials; i++) {
    console.log(`Running trial ${i} / ${trials}`)
    const trialResult = startDungeon(dungeon8, fruxParty)
    if (trialResult) {
        wins++
    }
}

console.log(`In ${trials} trials:`)
console.log(`Wins: ${wins}`)
console.log(`Losses: ${trials - wins}`)
console.log(`Winrate: ${(wins / trials) * 100}%`)