import settings from "./settings";

export function combatMessage(message) {
    if (settings.displayCombatEvents) {
        console.log(message)
    }
}
