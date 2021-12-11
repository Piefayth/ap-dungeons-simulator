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
import { dungeon6 } from '../../../simulator/src/dungeons/dungeon6'
import { dungeon7 } from '../../../simulator/src/dungeons/dungeon7'
import { dungeon8 } from '../../../simulator/src/dungeons/dungeon8'
import { dungeon9 } from '../../../simulator/src/dungeons/dungeon9'
import { dungeon10 } from '../../../simulator/src/dungeons/dungeon10'
import cloneDeep from 'lodash/cloneDeep'
import { ItemKind } from '../../../simulator/src/engine/itemTypes'

const demoParty: Actor[] = [{
    name: "piefayth",
    items: [new Items.BigClub(9), new Items.DrainingDagger(9), new Items.Freezeman(9), new Items.ChallengerArrow(9)],
    auras: [],
    maxHP: 155,
    curHP: 155,
    energy: 0,
    speed: 15,
    attackMin: 4,
    attackMax: 13,
}, {
    name: "zoop",
    items: [new Items.SurvivalKit(9), new Items.DrainingDagger(9), new Items.TrustySteed(9), new Items.BoostingBugle(9)],
    auras: [],
    maxHP: 155,
    curHP: 155,
    energy: 0,
    speed: 15,
    attackMin: 4,
    attackMax: 13,
}, {
    name: "tymp",
    items: [new Items.SurvivalKit(9), new Items.DrainingDagger(9), new Items.TrustySteed(9), new Items.BoostingBugle(9)],
    auras: [],
    maxHP: 140,
    curHP: 140,
    energy: 0,
    speed: 13,
    attackMin: 2,
    attackMax: 11,
}, {
    name: "tymp 2",
    items: [new Items.SurvivalKit(9), new Items.DrainingDagger(9), new Items.TrustySteed(9), new Items.EnergeticAlly(9)],
    auras: [],
    maxHP: 140,
    curHP: 140,
    energy: 0,
    speed: 13,
    attackMin: 2,
    attackMax: 11,
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
        pityScaling: (speed, pitySpeed) => pitySpeed + 0
    })

    const dungeonMap = {
        2: dungeon2,
        3: dungeon3,
        4: dungeon4,
        6: dungeon6,
        7: dungeon7,
        8: dungeon8,
        9: dungeon9,
        10: dungeon10
    }

    return simulator.simulate(options.trials, options.party, dungeonMap[options.dungeon])
}

const defaultResult: SimulationResult = {
    trials: 0,
    winrate: 0,
    wins: 0,
    losses: 0,
    results: [],
    party: []
}

const results = (resultData) => 
    <div style={{width: 300, paddingBottom: 30, margin: '0 auto'}}>
        Wins: {resultData.wins}
        <br />
        Losses: {resultData.trials - resultData.wins}
        <br />
        Winrate: {resultData.wins / resultData.trials}
    </div>

const addTeammateButton = (simData, setSimData) =>
    <Form.Item>
        <Button onClick={() => {
            let newSimData = { ...simData }
            newSimData.party = cloneDeep([...newSimData.party, demoParty[1] ])
            setSimData(newSimData)
        }}>
            Add Teammate
        </Button>
    </Form.Item>

export default function simulatorConfig(props: RouteComponentProps) {
    const oldState = props.location.state ? (props.location.state as any).party as Actor[] : undefined
    const navigate = useNavigate()
    
    const [simData, setSimData] = useState(cloneDeep(defaultSimulatorInputData))

    const [resultData, setResultData] = useState(defaultResult)

    // TODO:
    // Have button to show simulation combat log

    if (oldState) {
        props.location.state = {
            party: undefined
        }
        let newSimData = { ...simData }
        newSimData.party = cloneDeep(oldState)
        setSimData(newSimData)
    }

    return (
        <Form
            id="myform"
            name="basic"
            autoComplete="off"
       >
            { results(resultData) }
            
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
                    { simData.party.length < 5 ? addTeammateButton(simData, setSimData) : null }
                </Col>

                <Col span={7}>
                </Col>

                <Col span={4}>
                    <Form.Item>
                        <Button type="primary" onClick={() => {
                            const sanitizedSimData = sanitizeSimData(simData)
                            const result = runTrials(sanitizedSimData)
                            setResultData(result)
                            
                            navigate('./simulator', {
                                state: runTrials(sanitizedSimData)
                            })
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