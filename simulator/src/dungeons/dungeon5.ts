import { Dungeon } from "../engine/dungeon";
import { BigClub, CleansingFlames, FireSword, HealingPendant, ImpWhistle, KnightsLance, LoveLetter, MagicParasol, PoisonDagger, WhirlwindAxe } from "../items";
import { Avalanche } from "../items/avalanche";
import { BoostingBugle } from "../items/boostingBugle";
import { ExplosionPowder } from "../items/explosionPowder";
import { Machete } from "../items/machete";
import { RoughSkin } from "../items/roughSkin";
import { SeekingMissiles } from "../items/seekingMissiles";
import { Thorns } from "../items/thorns";

export const dungeon5: Dungeon = {
    tier: 5,
    floors: [{
        enemies: [{
            name: "Cidd The Helpful",
            items: [new SeekingMissiles(1), new FireSword(3)],
            auras: [],
            maxHP: 2,
            curHP: 2,
            energy: 0,
            speed: 100,
            attackMin: 4,
            attackMax: 4
        }, {
            name: "Treebeast",
            items: [],
            auras: [],
            maxHP: 120,
            curHP: 120,
            energy: 0,
            speed: 15,
            attackMin: 10,
            attackMax: 15
        }, {
            name: "Ivan, The Drunken Brawler",
            items: [new WhirlwindAxe(3)],
            auras: [],
            maxHP: 140,
            curHP: 140,
            energy: 0,
            speed: 16,
            attackMin: 15,
            attackMax: 20
        }, {
            name: "Brittney, Beach Princess",
            items: [],
            auras: [],
            maxHP: 160,
            curHP: 160,
            energy: 0,
            speed: 17,
            attackMin: 20,
            attackMax: 25
        }]
    }, {
        enemies: [{
            name: "The Wandering Fisherman",
            items: [],
            auras: [],
            maxHP: 125,
            curHP: 125,
            energy: 0,
            speed: 8,
            attackMin: 25,
            attackMax: 25
        }, {
            name: "The Great Forest Seer",
            items: [new Avalanche(3)],
            auras: [],
            maxHP: 150,
            curHP: 150,
            energy: 0,
            speed: 17,
            attackMin: 12,
            attackMax: 22
        }, {
            name: "The Masked Samurai",
            items: [new Machete(4)],
            auras: [],
            maxHP: 175,
            curHP: 175,
            energy: 0,
            speed: 21,
            attackMin: 12,
            attackMax: 16
        }]
    }, {
        enemies: [{
            name: "Dread Knight",
            items: [],
            auras: [],
            maxHP: 175,
            curHP: 175,
            energy: 0,
            speed: 9,
            attackMin: 30,
            attackMax: 50
        }, {
            name: "Betty Clicker",
            items: [new BoostingBugle(3)],
            auras: [],
            maxHP: 75,
            curHP: 75,
            energy: 200,
            speed: 15,
            attackMin: 5,
            attackMax: 5
        }, {
            name: "King Midas",
            items: [new HealingPendant(1), new MagicParasol(1)],
            auras: [],
            maxHP: 150,
            curHP: 150,
            energy: 0,
            speed: 11,
            attackMin: 10,
            attackMax: 15
        }, {
            name: "Leon",
            items: [new SeekingMissiles(3)],
            auras: [],
            maxHP: 100,
            curHP: 100,
            energy: 0,
            speed: 25,
            attackMin: 5,
            attackMax: 15
        }, {
            name: "Amenhotep",
            items: [],
            auras: [],
            maxHP: 40,
            curHP: 40,
            energy: 0,
            speed: 13,
            attackMin: 0,
            attackMax: 10
        }]
    }]
}