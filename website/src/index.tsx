import { DungeonSimulator } from "../../simulator/src/simulator"
import { dungeon8 } from "../../simulator/src/dungeons/dungeon8"
import { Actor } from "../../simulator/src/engine/actor"
import { Avalanche } from '../../simulator/src/items/avalanche'
import { BigClub } from '../../simulator/src/items/bigClub'
import { BoostingBugle } from '../../simulator/src/items/boostingBugle'
import { ChallengerArrow } from '../../simulator/src/items/challengerArrow'
import { ChumbyChicken } from '../../simulator/src/items/chicken'
import { CleansingFlames } from '../../simulator/src/items/cleansingFlames'
import { DrainingDagger } from '../../simulator/src/items/drainingDagger'
import { EnergeticAlly } from '../../simulator/src/items/energeticAlly'
import { ExplosionPowder } from '../../simulator/src/items/explosionPowder'
import { FireSword } from '../../simulator/src/items/fireSword'
import { Freezeman } from '../../simulator/src/items/freezeman'
import { Halberd } from '../../simulator/src/items/halberd'
import { HealingPendant } from '../../simulator/src/items/healingPendant'
import { ImpWhistle } from '../../simulator/src/items/impWhistle'
import { KnightsLance } from '../../simulator/src/items/knightsLance'
import { LoveLetter } from '../../simulator/src/items/loveLetter'
import { Machete } from '../../simulator/src/items/machete'
import { MagicParasol } from '../../simulator/src/items/magicParasol'
import { MartyrArmor } from '../../simulator/src/items/martyrArmor'
import { PetImp } from '../../simulator/src/items/petImp'
import { PoisonDagger } from '../../simulator/src/items/poisonDagger'
import { RockCompanion } from '../../simulator/src/items/rockCompanion'
import { SeekingMissiles } from '../../simulator/src/items/seekingMissiles'
import { SurvivalKit } from '../../simulator/src/items/survivalKit'
import { Thorns } from '../../simulator/src/items/thorns'
import { WhirlwindAxe } from '../../simulator/src/items/whirlwindAxe'
import SimulatorConfig from './components/simulatorConfig'
import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from '@reach/router'
import 'antd/dist/antd.less'
import { SimulationView } from "./components/simulationView"

const element = document.createElement('div')
document.body.appendChild(element)

ReactDOM.render(
  <Router>
    <SimulatorConfig path="/ap-dungeons-simulator/" />
    <SimulationView path="/ap-dungeons-simulator/simulator" />

    <SimulatorConfig path="/" />
    <SimulationView path="/simulator" />
  </Router>, 
element);