import { dungeon8 } from './dungeons/dungeon8'
import { dungeon9 } from './dungeons/dungeon9'
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

const testParty: Actor[] = [{
    name: "maurixxo",
    items: [new FireSword(7), new BigClub(7), new WhirlwindAxe(7), new ChallengerArrow(7)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 12,
    attackMin: 3,
    attackMax: 12
}, {
    name: "zoop",
    items: [new FireSword(7), new BigClub(7), new Freezeman(7), new ChallengerArrow(7)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 12,
    attackMin: 3,
    attackMax: 12
}, {
    name: "neonus",
    items: [new SurvivalKit(7), new HealingPendant(7), new KnightsLance(7), new MagicParasol(7)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 12,
    attackMin: 3,
    attackMax: 12
}, {
    name: "debuffer",
    items: [new SurvivalKit(7), new HealingPendant(7), new KnightsLance(7), new MagicParasol(7)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 12,
    attackMin: 3,
    attackMax: 12
}, {
    name: "anotherguy",
    items: [new ChumbyChicken(7), new EnergeticAlly(7), new Freezeman(7), new LoveLetter(7)],
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




let trials = 100
let wins = 0

for (let i = 0; i < trials; i++) {
    console.log(`Running trial ${i} / ${trials}`)
    const trialResult = startDungeon(dungeon9, testParty)
    if (trialResult) {
        wins++
    }
}

console.log(`In ${trials} trials:`)
console.log(`Wins: ${wins}`)
console.log(`Losses: ${trials - wins}`)
console.log(`Winrate: ${(wins / trials) * 100}%`)