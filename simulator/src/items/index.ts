import { ItemKind } from "../engine/itemTypes"
import { Avalanche } from "./avalanche"
import { BFCannon } from "./bfCannon"
import { BigClub } from "./bigClub"
import { BoostingBugle } from "./boostingBugle"
import { ChallengerArrow } from "./challengerArrow"
import { ChumbyChicken } from "./chicken"
import { CleansedTome } from "./cleansedTome"
import { CleansingFlames } from "./cleansingFlames"
import { DrainingDagger } from "./drainingDagger"
import { EnergeticAlly } from "./energeticAlly"
import { ExplosionPowder } from "./explosionPowder"
import { FestiveFeast } from "./festiveFeast"
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
import { RoughSkin } from "./roughSkin"
import { SeekingMissiles } from "./seekingMissiles"
import { SurvivalKit } from "./survivalKit"
import { Thorns } from "./thorns"
import { TrustySteed } from "./trustySteed"
import { WhirlwindAxe } from "./whirlwindAxe"

const itemKindMap = {
    [ItemKind.AVALANCHE]: Avalanche,
    [ItemKind.BF_CANNON]: BFCannon,
    [ItemKind.BIG_CLUB]: BigClub,
    [ItemKind.BOOSTING_BUGLE]: BoostingBugle,
    [ItemKind.CHALLENGER_ARROW]: ChallengerArrow,
    [ItemKind.CHUMBY_CHICKEN]: ChumbyChicken,
    [ItemKind.CLEANSED_TOME]: CleansedTome,
    [ItemKind.CLEANSING_FLAMES]: CleansingFlames,
    [ItemKind.DRAINING_DAGGER]: DrainingDagger,
    [ItemKind.ENERGETIC_ALLY]: EnergeticAlly,
    [ItemKind.EXPLOSION_POWDER]: ExplosionPowder,
    [ItemKind.FESTIVE_FEAST]: FestiveFeast,
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
    [ItemKind.ROUGH_SKIN]: RoughSkin,
    [ItemKind.ROCK_COMPANION]: RockCompanion,
    [ItemKind.SEEKING_MISSILES]: SeekingMissiles,
    [ItemKind.SURVIVAL_KIT]: SurvivalKit,
    [ItemKind.THORNS]: Thorns,
    [ItemKind.TRUSTY_STEED]: TrustySteed,
    [ItemKind.WHIRLWIND_AXE]: WhirlwindAxe,
}

export {
    itemKindMap,
    Avalanche,
    BFCannon,
    BigClub,
    BoostingBugle,
    ChallengerArrow,
    ChumbyChicken,
    CleansingFlames,
    CleansedTome,
    DrainingDagger,
    EnergeticAlly,
    ExplosionPowder,
    FestiveFeast,
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
    TrustySteed,
    WhirlwindAxe,
}