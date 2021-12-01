import { Dungeon } from "../engine/dungeon";
import { Avalanche } from "../items/avalanche";
import { BigClub } from "../items/bigClub";
import { BoostingBugle } from "../items/boostingBugle";
import { ChallengerArrow } from "../items/challengerArrow";
import { CleansingFlames } from "../items/cleansingFlames";
import { EnergeticAlly } from "../items/energeticAlly";
import { ExplosionPowder } from "../items/explosionPowder";
import { FireSword } from "../items/fireSword";
import { HealingPendant } from "../items/healingPendant";
import { ImpWhistle } from "../items/impWhistle";
import { LoveLetter } from "../items/loveLetter";
import { Machete } from "../items/machete";
import { MagicParasol } from "../items/magicParasol";
import { PoisonDagger } from "../items/poisonDagger";
import { SeekingMissiles } from "../items/seekingMissiles";
import { SurvivalKit } from "../items/survivalKit";
import { Thorns } from "../items/thorns";
import { WhirlwindAxe } from "../items/whirlwindAxe";

export const dungeon10: Dungeon = {
    tier: 10,
    floors: [{
        enemies: [{
            name: "Sonic the Hedgehog",
            items: [new FireSword(7)],
            auras: [],
            maxHP: 750,
            curHP: 750,
            energy: 0,
            speed: 150,
            attackMin: 30,
            attackMax: 50
        }]
    }, {
        enemies: [{
            name: "Amy Rose",
            items: [new WhirlwindAxe(9)],
            auras: [],
            maxHP: 250,
            curHP: 250,
            energy: 0,
            speed: 22,
            attackMin: 20,
            attackMax: 30
        }, {
            name: "Big the Cat",
            items: [new MagicParasol(3), new HealingPendant(3)],
            auras: [],
            maxHP: 300,
            curHP: 300,
            energy: 0,
            speed: 12,
            attackMin: 40,
            attackMax: 80
        }, {
            name: "Knuckles the Echidna",
            items: [new SeekingMissiles(5), new BigClub(6)],
            auras: [],
            maxHP: 200,
            curHP: 200,
            energy: 0,
            speed: 25,
            attackMin: 10,
            attackMax: 60
        }, {
            name: "Miles Tails Prowler",
            items: [new BoostingBugle(5), new Thorns(5), new CleansingFlames(7)],
            auras: [],
            maxHP: 250,
            curHP: 250,
            energy: 90,
            speed: 30,
            attackMin: 10,
            attackMax: 30
        }]
    }, {
        enemies: [{
            name: "Shadow The Hedgehog",
            items: [new Thorns(9), new ChallengerArrow(15), new HealingPendant(9)],
            auras: [],
            maxHP: 600,
            curHP: 600,
            energy: 0,
            speed: 80,
            attackMin: 5,
            attackMax: 20
        }]
    }]
}