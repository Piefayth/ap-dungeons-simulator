import React, { useState } from 'react'
import { RouteComponentProps, useNavigate } from "@reach/router"
import { Form, Button, Row, Col } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import * as Items from '../../../simulator/src/items'
import { Actor } from "../../../simulator/src/engine/actor"
import { DungeonSelection } from './dungeonSelection'
import { PartySelection } from './partySelection'
import { DungeonSimulator, SimulationResult } from '../../../simulator/src/simulator'
import { dungeon2 } from '../../../simulator/src/dungeons/dungeon2'
import { dungeon3 } from '../../../simulator/src/dungeons/dungeon3'
import { dungeon4 } from '../../../simulator/src/dungeons/dungeon4'
import { dungeon8 } from '../../../simulator/src/dungeons/dungeon8'
import { dungeon9 } from '../../../simulator/src/dungeons/dungeon9'
import { dungeon10 } from '../../../simulator/src/dungeons/dungeon10'
import cloneDeep from 'lodash/cloneDeep'
import { ItemKind } from '../../../simulator/src/engine/itemTypes'

const demoParty: Actor[] = [{
    name: "zoop",
    items: [new Items.KnightsLance(8), new Items.MartyrArmor(8), new Items.SurvivalKit(8), new Items.MagicParasol(8)],
    auras: [],
    maxHP: 100,
    curHP: 100,
    energy: 0,
    speed: 10,
    attackMin: 1,
    attackMax: 10
}, {
    name: "piefayth",
    items: [new Items.LoveLetter(8), new Items.Freezeman(8), new Items.Thorns(8), new Items.EnergeticAlly(8)],
    auras: [],
    maxHP: 100,
    curHP: 100,
    energy: 0,
    speed: 10,
    attackMin: 1,
    attackMax: 10
}, {
    name: "piefayth's cats",
    items: [new Items.Machete(8), new Items.Freezeman(8), new Items.Thorns(8), new Items.Avalanche(8)],
    auras: [],
    maxHP: 100,
    curHP: 100,
    energy: 0,
    speed: 10,
    attackMin: 1,
    attackMax: 10
}]

type SimulatorInputData = {
    trials: number,
    party: Actor[],
    dungeon: number
}

const defaultSimulatorInputData: SimulatorInputData = {
    trials: 1,
    party: demoParty,
    dungeon: 8
}

function runTrials(options: SimulatorInputData): SimulationResult {
    const itemRefreshedParty = options.party.map(actor => {
        actor.items = actor.items.map(item => {
            if (ItemKind[item.kind] === ItemKind.NONE) {
                return undefined
            } 
            
            const itemKind = Items.itemKindMap[item.kind] ? Items.itemKindMap[item.kind] : Items.itemKindMap[ItemKind[item.kind]]
            return new itemKind(item.tier)
        }).filter(item => item)

        return actor
    })

    const simulator = new DungeonSimulator({
        displayCombatEvents: false,
        displayPartyStates: false,
        pityScaling: speed => speed + 1
    })

    const dungeonMap = {
        2: dungeon2,
        3: dungeon3,
        4: dungeon4,
        8: dungeon8,
        9: dungeon9,
        10: dungeon10
    }

    return simulator.simulate(options.trials, options.party, dungeonMap[options.dungeon])
}

export default function simulatorConfig(props: RouteComponentProps) {
    const oldState = props.location.state ? (props.location.state as any).party as Actor[] : undefined
    const navigate = useNavigate()
    
    const [simData, setSimData] = useState(cloneDeep(defaultSimulatorInputData))

    // TODO:
    // Show winrates after simulate
    // Have button to show simulation combat log

    if (oldState) {
        props.location.state = {
            party: undefined
        }
        let newSimData = { ...simData }
        newSimData.party = cloneDeep(oldState)
        setSimData(newSimData)
    }

    const addTeammateButton =
        <Form.Item>
            <Button onClick={() => {
                let newSimData = { ...simData }
                newSimData.party = cloneDeep([...newSimData.party, demoParty[1] ])
                setSimData(newSimData)
            }}>
                Add Teammate
            </Button>
        </Form.Item>

    return (
        <Form
            id="myform"
            name="basic"
            autoComplete="off"
       >
            <DungeonSelection 
                defaultDungeon={8}
                defaultTrials={1}
                onUpdate={(trials, dungeon) => {
                    let newSimData = { ...simData }
                    newSimData.dungeon = dungeon
                    newSimData.trials = trials
                    setSimData(newSimData)
                }}
            />
            
            <Row style={{ width:300, margin: '0 auto'}}>
                <Col span={12}>
                    { simData.party.length < 5 ? addTeammateButton : null }
                </Col>

                <Col span={7}>
                </Col>

                <Col span={4}>
                    <Form.Item>
                        <Button type="primary" onClick={() => {
                            const sanitizedSimData = sanitizeSimData(simData)
                            runTrials(sanitizedSimData)
                            /*
                            navigate('./simulator', {
                                state: runTrials(sanitizedSimData)
                            })*/
                        }}>
                            Simulate
                        </Button>
                    </Form.Item>
                </Col>
            </Row>

            <PartySelection 
                party={simData.party}
                onUpdate={(party) => {
                    let newSimData = { ...simData }
                    newSimData.party = party
                    setSimData(newSimData)
                }}
            />
        </Form>
    )
}

function sanitizeSimData(simData: SimulatorInputData): SimulatorInputData {
    return {
        ...simData,
        party: simData.party
            .filter(actor => actor ? true: false)
            .map(actor => {
                actor.items = actor.items.filter(item => item ? true : false)
                return actor
            })
    }
}