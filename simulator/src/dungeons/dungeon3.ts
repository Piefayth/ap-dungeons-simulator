import { Dungeon } from "../engine/dungeon";
import { BigClub, CleansingFlames, HealingPendant, KnightsLance, LoveLetter, PoisonDagger, WhirlwindAxe } from "../items";
import { Avalanche } from "../items/avalanche";
import { BoostingBugle } from "../items/boostingBugle";
import { ExplosionPowder } from "../items/explosionPowder";
import { Machete } from "../items/machete";
import { RoughSkin } from "../items/roughSkin";
import { SeekingMissiles } from "../items/seekingMissiles";
import { Thorns } from "../items/thorns";

export const dungeon3: Dungeon = {
    tier: 3,
    floors: [{
        enemies: [{
            name: "Kappa",
            items: [new KnightsLance(2), new LoveLetter(2)],
            auras: [],
            maxHP: 100,
            curHP: 100,
            energy: 20,
            speed: 16,
            attackMin: 10,
            attackMax: 20
        }, {
            name: "KappaPride",
            items: [new KnightsLance(2), new LoveLetter(2)],
            auras: [],
            maxHP: 80,
            curHP: 80,
            energy: 10,
            speed: 16,
            attackMin: 8,
            attackMax: 14
        }]
    }, {
        enemies: [{
            name: "PepeHands",
            items: [new CleansingFlames(1)],
            auras: [],
            maxHP: 50,
            curHP: 50,
            energy: 0,
            speed: 12,
            attackMin: 8,
            attackMax: 12
        }, {
            name: "Pepega",
            items: [new PoisonDagger(2)],
            auras: [],
            maxHP: 75,
            curHP: 75,
            energy: 0,
            speed: 10,
            attackMin: 5,
            attackMax: 10
        }, {
            name: "MonkaS",
            items: [new BigClub(5)],
            auras: [],
            maxHP: 75,
            curHP: 75,
            energy: 0,
            speed: 11,
            attackMin: 1,
            attackMax: 30
        }, {
            name: "Rock Companion",
            items: [new HealingPendant(2)],
            auras: [],
            maxHP: 30,
            curHP: 30,
            energy: 0,
            speed: 2,
            attackMin: 10,
            attackMax: 10
        }]
    }, {
        enemies: [{
            name: "PogChamp",
            items: [new WhirlwindAxe(3)],
            auras: [],
            maxHP: 150,
            curHP: 150,
            energy: 0,
            speed: 15,
            attackMin: 10,
            attackMax: 30
        }, {
            name: "Pog",
            items: [],
            auras: [],
            maxHP: 125,
            curHP: 125,
            energy: 0,
            speed: 15,
            attackMin: 10,
            attackMax: 15
        }]
    }]
}