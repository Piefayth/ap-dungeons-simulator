import React, { useState } from 'react'
import { Card, Form, Input, Select, Row, Col } from 'antd'

type DungeonSelectionProps = {
    defaultTrials: number
    defaultDungeon: number
    onUpdate: (trials: number, dungeon: number) => void
}

type TrialsPickerProps = {
    onUpdate: (trials: number) => void
}

type DungeonPickerProps = {
    onUpdate: (dungeon: number) => void
}

const dungeons = [2, 3, 4, 8, 9, 10]

const TrialsPicker = (trialsPickerProps: TrialsPickerProps) => 
    <Row>
        <Col span={6}>
            Trials
        </Col>

        <Col span={1}></Col>

        <Col span={17}>
            <Form.Item>
                <Input 
                    defaultValue={ 1 }
                    onChange={ newValue => {
                        let updatedValue = parseInt(newValue.target.value)
                        if (isNaN(updatedValue)) {
                            trialsPickerProps.onUpdate(1)
                        } else {
                            trialsPickerProps.onUpdate(updatedValue)
                        }
                    }}
                />
            </Form.Item>
        </Col>

    </Row>

const DungeonPicker = (dungeonPickerProps: DungeonPickerProps) =>
    <Row>
    <Col span={19}>
        Dungeon
    </Col>

    <Col span={1}></Col>

    <Col span={4}>
        <Form.Item name='dungeon'>
            <Select 
                defaultValue={8}
                onChange = { (newValue) => dungeonPickerProps.onUpdate(newValue)}
            >
            {
                dungeons.map((level, index) => 
                    <Select.Option key={index} value={ level }> 
                        { level }
                    </Select.Option>
                )
            }
            </Select>
        </Form.Item>
    </Col>
    </Row>

export function DungeonSelection(props: DungeonSelectionProps) {
    const [trials, setTrials] = useState(props.defaultTrials)
    const [dungeon, setDungeon] = useState(props.defaultDungeon)

    return (
        <div style={{width: 300, margin: '0 auto', marginTop: 20}}>
            <TrialsPicker 
                onUpdate={(updatedTrials => {
                    setTrials(updatedTrials)
                    props.onUpdate(updatedTrials, dungeon)
                })}
            />

            <DungeonPicker
                onUpdate={(updatedDungeon) => {
                    setDungeon(updatedDungeon)
                    props.onUpdate(trials, updatedDungeon)
                }}
            />
        </div>
    )
}