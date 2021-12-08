import { DungeonSimulator } from './simulator'
import { itemKindMap } from './items'
import * as util from 'util'
import { ItemKind } from './engine/itemTypes'
import { Actor } from './engine/actor'
import { Dungeon } from './engine/dungeon'

function workerSimulate(trials: number, party: Actor[], dungeon: Dungeon, parentPort: any) {
    const simulator = new DungeonSimulator({
        displayCombatEvents: false,
        displayPartyStates: false,
        skipHistoryStorage: true,
        pityScaling: (speed, pitySpeed) => pitySpeed + 0
    })

    const instantiatedParty = party.map(actor => {
        actor.items = actor.items.map(
            itemData => new itemKindMap[itemData.kind](itemData.tier)
        )
        return actor
    })

    const instantiatedFloors = dungeon.floors.map(floor => {
        floor.enemies = floor.enemies.map(enemy => {
            enemy.items = enemy.items.map(
                itemData => new itemKindMap[itemData.kind](itemData.tier)
            )
            return enemy
        })
        return floor
    })

    dungeon.floors = instantiatedFloors

    for (let i = 0; i < trials; i++) {
        const result = simulator.simulateSingle(instantiatedParty, dungeon)

        parentPort.postMessage(
            result
        )
    }
}

if (typeof window === "undefined") {
    const { parentPort, workerData } = require('worker_threads')
    workerSimulate(workerData.trials, workerData.party, workerData.dungeon, parentPort)
}
