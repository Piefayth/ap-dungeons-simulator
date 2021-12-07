import { Dungeon } from "../engine/dungeon";
import { BigClub, CleansingFlames, HealingPendant, ImpWhistle, KnightsLance, LoveLetter, PoisonDagger, WhirlwindAxe } from "../items";
import { Avalanche } from "../items/avalanche";
import { BoostingBugle } from "../items/boostingBugle";
import { ExplosionPowder } from "../items/explosionPowder";
import { Machete } from "../items/machete";
import { RoughSkin } from "../items/roughSkin";
import { SeekingMissiles } from "../items/seekingMissiles";
import { Thorns } from "../items/thorns";

export const dungeon4: Dungeon = {
    tier: 4,
    floors: [{
        enemies: [{
            name: "G Fuel",
            items: [new ImpWhistle(2)],
            auras: [],
            maxHP: 80,
            curHP: 80,
            energy: 0,
            speed: 20,
            attackMin: 0,
            attackMax: 30
        }, {
            name: "Boba",
            items: [new Avalanche(1)],
            auras: [],
            maxHP: 125,
            curHP: 125,
            energy: 0,
            speed: 14,
            attackMin: 15,
            attackMax: 25
        }, {
            name: "A Hearty Glass of Water",
            items: [new LoveLetter(4)],
            auras: [],
            maxHP: 100,
            curHP: 100,
            energy: 0,
            speed: 12,
            attackMin: 10,
            attackMax: 20
        }]
    }, {
        enemies: [{
            name: "Mozzarella Sticks",
            items: [new PoisonDagger(3)],
            auras: [],
            maxHP: 91,
            curHP: 91,
            energy: 0,
            speed: 14,
            attackMin: 6,
            attackMax: 12
        }, {
            name: "Miso Soup",
            items: [],
            auras: [],
            maxHP: 50,
            curHP: 50,
            energy: 0,
            speed: 13,
            attackMin: 5,
            attackMax: 15
        }, {
            name: "Salad",
            items: [new HealingPendant(3)],
            auras: [],
            maxHP: 125,
            curHP: 125,
            energy: 0,
            speed: 12,
            attackMin: 5,
            attackMax: 14
        }, {
            name: "Takoyaki",
            items: [new PoisonDagger(3)],
            auras: [],
            maxHP: 66,
            curHP: 66,
            energy: 0,
            speed: 12,
            attackMin: 5,
            attackMax: 10
        }]
    }, {
        enemies: [{
            name: "Sushi Boat",
            items: [new Machete(2)],
            auras: [],
            maxHP: 350,
            curHP: 350,
            energy: 0,
            speed: 30,
            attackMin: 10,
            attackMax: 30
        }]
    }]
}