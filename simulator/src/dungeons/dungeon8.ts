import { Dungeon } from "../engine/dungeon";
import { Avalanche } from "../items/avalanche";
import { BoostingBugle } from "../items/boostingBugle";
import { ExplosionPowder } from "../items/explosionPowder";
import { Machete } from "../items/machete";
import { SeekingMissiles } from "../items/seekingMissiles";
import { Thorns } from "../items/thorns";

export const dungeon8: Dungeon = {
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
            speed: 20,
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
            items: [new SeekingMissiles(5)],
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