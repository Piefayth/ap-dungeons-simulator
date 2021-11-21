type Settings = {
    displayCombatEvents: boolean
    displayPartyStates: boolean
    pityScaling: (number) => number
}

const settings: Settings = {
    displayCombatEvents: false,
    displayPartyStates: false,
    pityScaling: (speed) => speed + 1
}

export default settings