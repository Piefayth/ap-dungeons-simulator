import { ItemKind } from "../engine/itemTypes"
import { Avalanche } from "./avalanche"
import { BigClub } from "./bigClub"
import { BoostingBugle } from "./boostingBugle"
import { ChallengerArrow } from "./challengerArrow"
import { ChumbyChicken } from "./chicken"
import { CleansingFlames } from "./cleansingFlames"
import { DrainingDagger } from "./drainingDagger"
import { EnergeticAlly } from "./energeticAlly"
import { ExplosionPowder } from "./explosionPowder"
import { FireSword } from "./fireSword"
import { Freezeman } from "./freezeman"
import { Halberd } from "./halberd"
import { HealingPendant } from "./healingPendant"
import { ImpWhistle } from "./impWhistle"
import { KnightsLance } from "./knightsLance"
import { LoveLetter } from "./loveLetter"
import { Machete } from "./machete"
import { MagicParasol } from "./magicParasol"
import { MartyrArmor } from "./martyrArmor"
import { PetImp } from "./petImp"
import { PoisonDagger } from "./poisonDagger"
import { RockCompanion } from "./rockCompanion"
import { SeekingMissiles } from "./seekingMissiles"
import { SurvivalKit } from "./survivalKit"
import { Thorns } from "./thorns"
import { WhirlwindAxe } from "./whirlwindAxe"

const itemKindMap = {
    [ItemKind.AVALANCHE]: Avalanche,
    [ItemKind.BIG_CLUB]: BigClub,
    [ItemKind.BOOSTING_BUGLE]: BoostingBugle,
    [ItemKind.CHALLENGER_ARROW]: ChallengerArrow,
    [ItemKind.CHUMBY_CHICKEN]: ChumbyChicken,
    [ItemKind.CLEANSING_FLAMES]: CleansingFlames,
    [ItemKind.DRAINING_DAGGER]: DrainingDagger,
    [ItemKind.ENERGETIC_ALLY]: EnergeticAlly,
    [ItemKind.EXPLOSION_POWDER]: ExplosionPowder,
    [ItemKind.FIRE_SWORD]: FireSword,
    [ItemKind.FREEZEMAN]: Freezeman,
    [ItemKind.HALBERD]: Halberd,
    [ItemKind.HEALING_PENDANT]: HealingPendant,
    [ItemKind.IMP_WHISTLE]: ImpWhistle,
    [ItemKind.KNIGHTS_LANCE]: KnightsLance,
    [ItemKind.LOVE_LETTER]: LoveLetter,
    [ItemKind.MACHETE]: Machete,
    [ItemKind.MAGIC_PARASOL]: MagicParasol,
    [ItemKind.MARTYR_ARMOR]: MartyrArmor,
    [ItemKind.PET_IMP]: PetImp,
    [ItemKind.POISON_DAGGER]: PoisonDagger,
    [ItemKind.ROCK_COMPANION]: RockCompanion,
    [ItemKind.SEEKING_MISSILES]: SeekingMissiles,
    [ItemKind.SURVIVAL_KIT]: SurvivalKit,
    [ItemKind.THORNS]: Thorns,
    [ItemKind.WHIRLWIND_AXE]: WhirlwindAxe,
}

export {
    itemKindMap,
    Avalanche,
    BigClub,
    BoostingBugle,
    ChallengerArrow,
    ChumbyChicken,
    CleansingFlames,
    DrainingDagger,
    EnergeticAlly,
    ExplosionPowder,
    FireSword,
    Freezeman,
    Halberd,
    HealingPendant,
    ImpWhistle,
    KnightsLance,
    LoveLetter,
    Machete,
    MagicParasol,
    MartyrArmor,
    PetImp,
    PoisonDagger,
    RockCompanion,
    SeekingMissiles,
    SurvivalKit,
    Thorns,
    WhirlwindAxe,
}