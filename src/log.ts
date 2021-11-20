import settings from "./settings";

const combatMessage = message => {
    if (settings.displayCombatEvents) {
        console.log(message)
    }
}

export {
    combatMessage
}