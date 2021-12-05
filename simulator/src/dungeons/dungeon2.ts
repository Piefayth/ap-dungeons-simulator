import { Dungeon } from "../engine/dungeon";
import { PoisonDagger } from "../items";
import { Avalanche } from "../items/avalanche";
import { BoostingBugle } from "../items/boostingBugle";
import { ExplosionPowder } from "../items/explosionPowder";
import { Machete } from "../items/machete";
import { RoughSkin } from "../items/roughSkin";
import { SeekingMissiles } from "../items/seekingMissiles";
import { Thorns } from "../items/thorns";

export const dungeon2: Dungeon = {
    tier: 2,
    floors: [{
        enemies: [{
            name: "Pig",
            items: [],
            auras: [],
            maxHP: 35,
            curHP: 35,
            energy: 0,
            speed: 12,
            attackMin: 6,
            attackMax: 8
        }, {
            name: "Ribbon Pig",
            items: [],
            auras: [],
            maxHP: 35,
            curHP: 35,
            energy: 0,
            speed: 12,
            attackMin: 6,
            attackMax: 8
        }, {
            name: "Boar",
            items: [],
            auras: [],
            maxHP: 35,
            curHP: 35,
            energy: 0,
            speed: 12,
            attackMin: 6,
            attackMax: 8
        }, {
            name: "Fire Boar",
            items: [],
            auras: [],
            maxHP: 50,
            curHP: 50,
            energy: 0,
            speed: 15,
            attackMin: 8,
            attackMax: 12
        }]
    }, {
        enemies: [{
            name: "Horny Mushroom",
            items: [],
            auras: [],
            maxHP: 60,
            curHP: 60,
            energy: 0,
            speed: 10,
            attackMin: 15,
            attackMax: 15
        }, {
            name: "Orange Mushroom",
            items: [],
            auras: [],
            maxHP: 45,
            curHP: 45,
            energy: 0,
            speed: 12,
            attackMin: 8,
            attackMax: 16
        }, {
            name: "Green Mushroom",
            items: [new PoisonDagger(1)],
            auras: [],
            maxHP: 45,
            curHP: 45,
            energy: 0,
            speed: 10,
            attackMin: 10,
            attackMax: 15
        }]
    }, {
        enemies: [{
            name: "Red Snail",
            items: [new RoughSkin(1)],
            auras: [],
            maxHP: 20,
            curHP: 20,
            energy: 0,
            speed: 3,
            attackMin: 1,
            attackMax: 2
        }, {
            name: "A Very Large Snail",
            items: [new RoughSkin(3)],
            auras: [],
            maxHP: 150,
            curHP: 150,
            energy: 0,
            speed: 7,
            attackMin: 20,
            attackMax: 40
        }, {
            name: "Blue Snail",
            items: [new RoughSkin(1)],
            auras: [],
            maxHP: 20,
            curHP: 20,
            energy: 0,
            speed: 3,
            attackMin: 1,
            attackMax: 2
        }]
    }]
}