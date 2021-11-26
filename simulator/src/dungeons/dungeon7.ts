import { EnergeticAlly } from "../../../build/simulator/src/items/energeticAlly";
import { Dungeon } from "../engine/dungeon";
import { ChallengerArrow, KnightsLance, LoveLetter, MagicParasol, PoisonDagger } from "../items";
import { Avalanche } from "../items/avalanche";
import { BoostingBugle } from "../items/boostingBugle";
import { ExplosionPowder } from "../items/explosionPowder";
import { Machete } from "../items/machete";
import { RoughSkin } from "../items/roughSkin";
import { SeekingMissiles } from "../items/seekingMissiles";
import { Thorns } from "../items/thorns";

export const dungeon7: Dungeon = {
    tier: 7,
    floors: [{
        enemies: [{
            name: "Boosette",
            items: [new SeekingMissiles(1)],
            auras: [],
            maxHP: 200,
            curHP: 200,
            energy: 0,
            speed: 15,
            attackMin: 30,
            attackMax: 69
        }, {
            name: "Bowsette",
            items: [new RoughSkin(3)],
            auras: [],
            maxHP: 140,
            curHP: 140,
            energy: 0,
            speed: 15,
            attackMin: 30,
            attackMax: 69
        }]
    }, {
        enemies: [{
            name: "Emilia",
            items: [new ChallengerArrow(5)],
            auras: [],
            maxHP: 175,
            curHP: 175,
            energy: 55,
            speed: 15,
            attackMin: 15,
            attackMax: 25
        }, {
            name: "Rem",
            items: [new ChallengerArrow(5)],
            auras: [],
            maxHP: 225,
            curHP: 225,
            energy: 55,
            speed: 17,
            attackMin: 10,
            attackMax: 20
        }, {
            name: "Ram",
            items: [],
            auras: [],
            maxHP: 150,
            curHP: 150,
            energy: 0,
            speed: 17,
            attackMin: 25,
            attackMax: 50
        }, {
            name: "Puck",
            items: [],
            auras: [],
            maxHP: 10,
            curHP: 10,
            energy: 0,
            speed: 16,
            attackMin: 3,
            attackMax: 4
        }]
    }, {
        enemies: [{
            name: "Megumin",
            items: [new ExplosionPowder(7)],
            auras: [],
            maxHP: 150,
            curHP: 150,
            energy: 40,
            speed: 18,
            attackMin: 1,
            attackMax: 2
        }, {
            name: "Aqua",
            items: [new LoveLetter(6), new EnergeticAlly(3)],
            auras: [],
            maxHP: 150,
            curHP: 150,
            energy: 0,
            speed: 25,
            attackMin: 10,
            attackMax: 20
        }, {
            name: "Darkness",
            items: [new KnightsLance(5), new MagicParasol(7), new PoisonDagger(1)],
            auras: [],
            maxHP: 200,
            curHP: 200,
            energy: 0,
            speed: 15,
            attackMin: 4,
            attackMax: 9
        }]
    }]
}