type Settings = {
    displayCombatEvents: boolean
    displayPartyStates: boolean
    pityScaling: (number) => number
}

const settings: Settings = {
    displayCombatEvents: true,
    displayPartyStates: false,
    pityScaling: (speed) => speed + 1
}

export default settings