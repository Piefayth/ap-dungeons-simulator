export type Settings = {
    displayCombatEvents: boolean
    displayPartyStates: boolean,
    skipHistoryStorage?: boolean,
    pityScaling: (speed, pitySpeed) => number
}
