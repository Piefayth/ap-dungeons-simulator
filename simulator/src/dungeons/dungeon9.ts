import { Dungeon } from "../engine/dungeon";
import { Avalanche } from "../items/avalanche";
import { BigClub } from "../items/bigClub";
import { BoostingBugle } from "../items/boostingBugle";
import { ChallengerArrow } from "../items/challengerArrow";
import { EnergeticAlly } from "../items/energeticAlly";
import { ExplosionPowder } from "../items/explosionPowder";
import { HealingPendant } from "../items/healingPendant";
import { ImpWhistle } from "../items/impWhistle";
import { LoveLetter } from "../items/loveLetter";
import { Machete } from "../items/machete";
import { MagicParasol } from "../items/magicParasol";
import { PoisonDagger } from "../items/poisonDagger";
import { RoughSkin } from "../items/roughSkin";
import { SeekingMissiles } from "../items/seekingMissiles";
import { SurvivalKit } from "../items/survivalKit";
import { Thorns } from "../items/thorns";

export const dungeon9: Dungeon = {
    tier: 9,
    floors: [{
        enemies: [{
            name: "Trundle",
            items: [new ChallengerArrow(2)],
            auras: [],
            maxHP: 250,
            curHP: 250,
            energy: 999,
            speed: 17,
            attackMin: 20,
            attackMax: 75
        }, {
            name: "Sejuani",
            items: [new Avalanche(4)],
            auras: [],
            maxHP: 250,
            curHP: 250,
            energy: 0,
            speed: 13,
            attackMin: 50,
            attackMax: 100
        }, {
            name: "Teemo",
            items: [new PoisonDagger(5)],
            auras: [],
            maxHP: 100,
            curHP: 100,
            energy: 0,
            speed: 20,
            attackMin: 10,
            attackMax: 20
        }, {
            name: "Ezreal",
            items: [new PoisonDagger(5)],
            auras: [],
            maxHP: 100,
            curHP: 100,
            energy: 0,
            speed: 20,
            attackMin: 10,
            attackMax: 20
        }]
    }, {
        enemies: [{
            name: "Tahm Kench",
            items: [new HealingPendant(5), new MagicParasol(6), new RoughSkin(5)],
            auras: [],
            maxHP: 200,
            curHP: 200,
            energy: 0,
            speed: 6,
            attackMin: 50,
            attackMax: 150
        }, {
            name: "Braum",
            items: [new MagicParasol(4), new SurvivalKit(8), new RoughSkin(5)],
            auras: [],
            maxHP: 300,
            curHP: 300,
            energy: 0,
            speed: 7,
            attackMin: 50,
            attackMax: 100
        }, {
            name: "Brand",
            items: [new Thorns(7), new ExplosionPowder(5), new Machete(4)],
            auras: [],
            maxHP: 150,
            curHP: 150,
            energy: 0,
            speed: 11,
            attackMin: 10,
            attackMax: 20
        }, {
            name: "Zyra",
            items: [new Thorns(7), new ImpWhistle(8), new Machete(4)],
            auras: [],
            maxHP: 150,
            curHP: 150,
            energy: 0,
            speed: 15,
            attackMin: 5,
            attackMax: 25
        }, {
            name: "Sona",
            items: [new EnergeticAlly(7), new LoveLetter(7)],
            auras: [],
            maxHP: 150,
            curHP: 150,
            energy: 0,
            speed: 12,
            attackMin: 20,
            attackMax: 30
        }]
    }, {
        enemies: [{
            name: "Riven",
            items: [new Machete(9), new BigClub(9)],
            auras: [],
            maxHP: 500,
            curHP: 500,
            energy: 0,
            speed: 20,
            attackMin: 40,
            attackMax: 90
        }, {
            name: "Yasuo",
            items: [],
            auras: [],
            maxHP: 250,
            curHP: 250,
            energy: 0,
            speed: 20,
            attackMin: 1,
            attackMax: 150
        }]
    }]
}