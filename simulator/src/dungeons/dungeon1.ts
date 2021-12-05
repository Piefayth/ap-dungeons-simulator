import { Dungeon } from "../engine/dungeon";
import { FireSword, LoveLetter, PoisonDagger } from "../items";

export const dungeon1: Dungeon = {
    tier: 1,
    floors: [{
        enemies: [{
            name: "Blob",
            items: [],
            auras: [],
            maxHP: 10,
            curHP: 10,
            energy: 0,
            speed: 10,
            attackMin: 2,
            attackMax: 2
        }, {
            name: "Blobther",
            items: [],
            auras: [],
            maxHP: 15,
            curHP: 15,
            energy: 0,
            speed: 10,
            attackMin: 2,
            attackMax: 4
        }, {
            name: "Blob's Mom",
            items: [],
            auras: [],
            maxHP: 20,
            curHP: 20,
            energy: 0,
            speed: 10,
            attackMin: 3,
            attackMax: 3
        }, {
            name: "Blob's Dad",
            items: [],
            auras: [],
            maxHP: 20,
            curHP: 20,
            energy: 0,
            speed: 10,
            attackMin: 3,
            attackMax: 4
        }, {
            name: "Blob's Grandpa",
            items: [],
            auras: [],
            maxHP: 30,
            curHP: 30,
            energy: 0,
            speed: 10,
            attackMin: 8,
            attackMax: 16
        }]
    }, {
        enemies: [{
            name: "Bandit",
            items: [],
            auras: [],
            maxHP: 15,
            curHP: 15,
            energy: 0,
            speed: 12,
            attackMin: 6,
            attackMax: 10
        }, {
            name: "Bandit's Hot GF",
            items: [],
            auras: [],
            maxHP: 20,
            curHP: 20,
            energy: 0,
            speed: 12,
            attackMin: 8,
            attackMax: 10
        }, {
            name: "Bandad",
            items: [],
            auras: [],
            maxHP: 25,
            curHP: 25,
            energy: 0,
            speed: 12,
            attackMin: 8,
            attackMax: 12
        }, {
            name: "Bandit's Twin",
            items: [],
            auras: [],
            maxHP: 15,
            curHP: 15,
            energy: 0,
            speed: 12,
            attackMin: 6,
            attackMax: 10
        }]
    }, {
        enemies: [{
            name: "Albert",
            items: [new FireSword(1)],
            auras: [],
            maxHP: 100,
            curHP: 53,
            energy: 0,
            speed: 10,
            attackMin: 6,
            attackMax: 15
        }, {
            name: "Annie",
            items: [new LoveLetter(1)],
            auras: [],
            maxHP: 100,
            curHP: 45,
            energy: 0,
            speed: 10,
            attackMin: 3,
            attackMax: 12
        }, {
            name: "Kelvinzorz",
            items: [new PoisonDagger(1)],
            auras: [],
            maxHP: 100,
            curHP: 43,
            energy: 0,
            speed: 10,
            attackMin: 3,
            attackMax: 12
        }]
    }]
}