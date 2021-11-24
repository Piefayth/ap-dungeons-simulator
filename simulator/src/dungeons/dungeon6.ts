import { Dungeon } from "../engine/dungeon";
import { BigClub, ChallengerArrow, CleansingFlames, DrainingDagger, FireSword, HealingPendant, ImpWhistle, KnightsLance, LoveLetter, MartyrArmor, PoisonDagger, WhirlwindAxe } from "../items";
import { Avalanche } from "../items/avalanche";
import { BoostingBugle } from "../items/boostingBugle";
import { ExplosionPowder } from "../items/explosionPowder";
import { Machete } from "../items/machete";
import { RoughSkin } from "../items/roughSkin";
import { SeekingMissiles } from "../items/seekingMissiles";
import { Thorns } from "../items/thorns";

export const dungeon6: Dungeon = {
    tier: 6,
    floors: [{
        enemies: [{
            name: "Tenya Iida",
            items: [new BoostingBugle(1)],
            auras: [],
            maxHP: 175,
            curHP: 175,
            energy: 999,
            speed: 25,
            attackMin: 5,
            attackMax: 15
        }, {
            name: "Shoto Todoroki",
            items: [new Avalanche(3), new FireSword(5)],
            auras: [],
            maxHP: 200,
            curHP: 200,
            energy: 0,
            speed: 12,
            attackMin: 0,
            attackMax: 40
        }, {
            name: "Tsuyu Asui",
            items: [new DrainingDagger(1), new RoughSkin(2)],
            auras: [],
            maxHP: 150,
            curHP: 150,
            energy: 0,
            speed: 18,
            attackMin: 5,
            attackMax: 25
        }]
    }, {
        enemies: [{
            name: "Fat Gum",
            items: [new MartyrArmor(3)],
            auras: [],
            maxHP: 300,
            curHP: 300,
            energy: 0,
            speed: 6,
            attackMin: 50,
            attackMax: 100
        }, {
            name: "Hawks",
            items: [new ChallengerArrow(2), new Thorns(3)],
            auras: [],
            maxHP: 200,
            curHP: 200,
            energy: 30, // double check this
            speed: 35,
            attackMin: 5,
            attackMax: 10
        }]
    }, {
        enemies: [{
            name: "All-Might",
            items: [],
            auras: [],
            maxHP: 200,
            curHP: 200,
            energy: 0,
            speed: 15,
            attackMin: 35,
            attackMax: 60
        }, {
            name: "Izuku Midoriya",
            items: [],
            auras: [],
            maxHP: 200,
            curHP: 200,
            energy: 0,
            speed: 25,
            attackMin: 20,
            attackMax: 35
        }]
    }]
}