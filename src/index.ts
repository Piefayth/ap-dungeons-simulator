import { Actor } from './engine/actor'
import { Dungeon, startDungeon } from './engine/dungeon'
import { ItemKind } from './engine/itemTypes'

const currentParty: Actor[] = [{
    name: "Piefayth",
    items: [{
        kind: ItemKind.BIG_CLUB,
        tier: 5
    }, {
        kind: ItemKind.CHUMBY_CHICKEN,
        tier: 2
    }],
    auras: [],
    maxHP: 110,
    curHP: 110,
    energy: 0,
    speed: 12,
    attackMin: 10,
    attackMax: 11
}, {
    name: "zoop",
    items: [{
        kind: ItemKind.MACHETE,
        tier: 2
    }, {
        kind: ItemKind.CHUMBY_CHICKEN,
        tier: 2
    }],
    auras: [],
    maxHP: 110,
    curHP: 110,
    energy: 0,
    speed: 12,
    attackMin: 1,
    attackMax: 10
}]

const currentDungeon: Dungeon = {
    tier: 1,
    floors: [{
        enemies: [{
            name: "angery face",
            items: [],
            auras: [],
            maxHP: 90,
            curHP: 90,
            energy: 0,
            speed: 10,
            attackMin: 10,
            attackMax: 20
        }, {
            name: "d face",
            items: [],
            auras: [],
            maxHP: 50,
            curHP: 50,
            energy: 0,
            speed: 5,
            attackMin: 10,
            attackMax: 20
        }]
    }]
}

for (let i = 0; i < 1; i++) {
    startDungeon(currentDungeon, currentParty)
}

/*

D1
    blob 10/10, 10, 2-2, 0
    blobther 15/15, 10, 2-4, 0
    blob's mom 20/20, 10, 3-3, 0
    blob's dad 20/20, 10, 3-4, 0
    blob's grandpa 30/30, 10, 8-16, 0
*/