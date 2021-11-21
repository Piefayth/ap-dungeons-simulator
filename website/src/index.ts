import { DungeonSimulator } from "../../simulator/src"
import { dungeon8 } from "../../simulator/src/dungeons/dungeon8"
import { Actor } from "../../simulator/src/engine/actor"
import { Avalanche } from '../../simulator/src/items/avalanche'
import { BigClub } from '../../simulator/src/items/bigClub'
import { BoostingBugle } from '../../simulator/src/items/boostingBugle'
import { ChallengerArrow } from '../../simulator/src/items/challengerArrow'
import { ChumbyChicken } from '../../simulator/src/items/chicken'
import { CleansingFlames } from '../../simulator/src/items/cleansingFlames'
import { DrainingDagger } from '../../simulator/src/items/drainingDagger'
import { EnergeticAlly } from '../../simulator/src/items/energeticAlly'
import { ExplosionPowder } from '../../simulator/src/items/explosionPowder'
import { FireSword } from '../../simulator/src/items/fireSword'
import { Freezeman } from '../../simulator/src/items/freezeman'
import { Halberd } from '../../simulator/src/items/halberd'
import { HealingPendant } from '../../simulator/src/items/healingPendant'
import { ImpWhistle } from '../../simulator/src/items/impWhistle'
import { KnightsLance } from '../../simulator/src/items/knightsLance'
import { LoveLetter } from '../../simulator/src/items/loveLetter'
import { Machete } from '../../simulator/src/items/machete'
import { MagicParasol } from '../../simulator/src/items/magicParasol'
import { MartyrArmor } from '../../simulator/src/items/martyrArmor'
import { PetImp } from '../../simulator/src/items/petImp'
import { PoisonDagger } from '../../simulator/src/items/poisonDagger'
import { RockCompanion } from '../../simulator/src/items/rockCompanion'
import { SeekingMissiles } from '../../simulator/src/items/seekingMissiles'
import { SurvivalKit } from '../../simulator/src/items/survivalKit'
import { Thorns } from '../../simulator/src/items/thorns'
import { WhirlwindAxe } from '../../simulator/src/items/whirlwindAxe'

function component() {
    const element = document.createElement('div')

    element.innerHTML = 'hello world'

    return element
}

document.body.appendChild(component())

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
}, {
    name: "neonus",
    items: [new Avalanche(8), new MartyrArmor(8), new SurvivalKit(8), new MagicParasol(8)],
    auras: [],
    maxHP: 130,
    curHP: 130,
    energy: 0,
    speed: 12,
    attackMin: 3,
    attackMax: 12
}, {
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
}]



const simulator = new DungeonSimulator()
simulator.simulate(1, testParty, dungeon8)