import { Settings } from 'http2'
import { dungeon10 } from './dungeons/dungeon10'
import { dungeon2 } from './dungeons/dungeon2'
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
    items: [new Avalanche(8), new MartyrArmor(8), new SurvivalKit(8), new MagicParasol(8)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 12,
    attackMin: 3,
    attackMax: 12
}, {
    name: "zoop",
    items: [new Avalanche(8), new MartyrArmor(8), new SurvivalKit(8), new MagicParasol(8)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 12,
    attackMin: 3,
    attackMax: 12
}/*, {
    name: "debuffer",
    items: [new Avalanche(8), new Freezeman(8), new Thorns(8), new LoveLetter(8)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 12,
    attackMin: 3,
    attackMax: 12
}, {
    name: "anotherguy",
    items: [new Avalanche(8), new Freezeman(8), new Thorns(8), new LoveLetter(8)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 12,
    attackMin: 3,
    attackMax: 12
}*/]
/*
const testParty2: Actor[] = [{
    name: "Piefayth",
    items: [new WhirlwindAxe(1)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 6,
    attackMin: 15,
    attackMax: 24
}, {
    name: "january",
    items: [new ImpWhistle(1), new BFCannon(1)],
    auras: [],
    maxHP: 100,
    curHP: 100,
    energy: 0,
    speed: 12,
    attackMin: 3,
    attackMax: 12
}, {
    name: "saki",
    items: [],
    auras: [],
    maxHP: 115,
    curHP: 115,
    energy: 0,
    speed: 11,
    attackMin: 2,
    attackMax: 11
}, {
    name: "birb",
    items: [new Avalanche(1), new ChumbyChicken(1)],
    auras: [],
    maxHP: 115,
    curHP: 115,
    energy: 0,
    speed: 10,
    attackMin: 2,
    attackMax: 11
}]*/

const testParty3: Actor[] = [{
    name: "birb",
    items: [new MartyrArmor(7), new SurvivalKit(7), new TrustySteed(7), new Avalanche(7)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 12,
    attackMin: 3,
    attackMax: 12
}, {
    name: "zoop",
    items: [new MartyrArmor(7), new SurvivalKit(7), new TrustySteed(7), new Avalanche(7)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 12,
    attackMin: 3,
    attackMax: 12
}, {
    name: "piefayth",
    items: [new MartyrArmor(7), new SurvivalKit(7), new TrustySteed(7), new Avalanche(7)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 12,
    attackMin: 3,
    attackMax: 12
}, {
    name: "birb",
    items: [new MartyrArmor(7), new SurvivalKit(7), new TrustySteed(7), new Avalanche(7)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 12,
    attackMin: 3,
    attackMax: 12
}, {
    name: "jan",
    items: [new MartyrArmor(7), new SurvivalKit(7), new TrustySteed(7), new Avalanche(7)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 12,
    attackMin: 3,
    attackMax: 12
}]

if (require.main === module && typeof window == "undefined") {
    const simulator = new DungeonSimulator({
        displayCombatEvents: false,
        displayPartyStates: false,
        pityScaling: (speed) => speed + 0
    })
    simulator.simulate(1000, testParty3, dungeon9)
}