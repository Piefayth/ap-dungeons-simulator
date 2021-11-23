import { Actor } from '../../../simulator/src/engine/actor'
import { Item } from '../../../simulator/src/engine/item'
import { ItemKind } from '../../../simulator/src/engine/itemTypes'
import * as Items from '../../../simulator/src/items'
import React, { useState } from 'react'
import { Card, Form, Input, Select, Row, Col, Button } from 'antd'
import { CloseOutlined } from '@ant-design/icons'

type PlayerCardProps = {
    onUpdate: (actor: Actor) => void,
    actor: Actor,
    index: number,
}

type PrestigePickerProps = {
    label: string
    level: number
    onUpdate: (tier: number) => void
}

type ItemPickerProps = {
    defaultItem: Item
    onUpdate: (kind: ItemKind, tier: number) => void
}

type NamePickerProps = {
    defaultName: string
    onUpdate: (name: string) => void
}

const items = [
    ...Object.keys(ItemKind)
]

const tiers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const prestige = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

const NamePicker = (namePickerProps: NamePickerProps) => 
    <Row>
        <Col span={6}>
            Name
        </Col>

        <Col span={1}></Col>

        <Col span={17}>
            <Form.Item>
                <Input 
                    defaultValue = { namePickerProps.defaultName }
                    onBlur = { newValue => namePickerProps.onUpdate(newValue.target.value) }
                />
            </Form.Item>
        </Col>

    </Row>

const PrestigePicker = (prestigePickerProps: PrestigePickerProps) => {
    return (
        <Row>
        <Col span={19}>
            { prestigePickerProps.label }
        </Col>

        <Col span={1}></Col>

        <Col span={4}>
            <Form.Item>
                <Select 
                    defaultValue={prestigePickerProps.level}
                    onChange = { (newValue) => {
                        prestigePickerProps.onUpdate(newValue)
                    }}
                >
                {
                    prestige.map((level, index) => 
                        <Select.Option key={index} value={ level }> 
                            { level }
                        </Select.Option>
                    )
                }
                </Select>
            </Form.Item>
        </Col>
        </Row>
    )
}

function ItemPicker(itemPickerProps: ItemPickerProps) {
    const [itemKind, setItemKind] = useState(itemPickerProps.defaultItem ? itemPickerProps.defaultItem.kind : ItemKind.NONE)
    const [tier, setTier] = useState(itemPickerProps.defaultItem ? itemPickerProps.defaultItem.tier : 1)

    return (
        <Row>
            <Col span={19}>
                <Form.Item>
                    <Select 
                        defaultValue={itemPickerProps.defaultItem ? itemPickerProps.defaultItem.kind : ItemKind.NONE}
                        onChange={(newKind) => {
                            setItemKind(newKind)
                            itemPickerProps.onUpdate(newKind, tier)
                        }}
                    >
                        {
                            items.map((item, index) => 
                                <Select.Option key={index} value={item}> 
                                    { ItemKind[item].toString() }
                                </Select.Option>
                            )
                        }
                    </Select>
                </Form.Item>
            </Col>

            <Col span={1}></Col>

            <Col span={4}>
                <Form.Item>
                    <Select 
                        defaultValue={itemPickerProps.defaultItem ? itemPickerProps.defaultItem.tier : 1}
                        onChange={(newTier) => {
                            setTier(newTier)
                            itemPickerProps.onUpdate(itemKind, newTier)
                        }}
                    >
                        {
                            tiers.map((tier, index) => 
                                <Select.Option key={index} value={ tier }> 
                                    { tier }
                                </Select.Option>
                            )
                        }
                    </Select>
                </Form.Item>
            </Col>
        </Row>
    )
}

export function PlayerCard(playerCardProps: PlayerCardProps) {
    const actor = playerCardProps.actor

    return (
        <Card style={{ width: '400px', marginRight: 20, marginTop: 20}}>
            <Row>
                <Col span={20} />
                <Col span={4}>
                    <Button  danger style={{ float:'right', marginBottom: 20}} onClick={() => {
                        playerCardProps.onUpdate(undefined)
                    }}>
                        <CloseOutlined />
                    </Button>
                </Col>
            </Row>

            <NamePicker 
                defaultName={ playerCardProps.actor.name }
                onUpdate={(updatedName) => {
                    actor.name = updatedName
                    playerCardProps.onUpdate(actor)
                }}
            />
            <PrestigePicker 
                label="HP Prestige Level"
                level={(actor.maxHP - 100) / 5}
                key={`${actor.name}hppr`}
                onUpdate={(hppr) => {
                    const updatedHealth = 100 + hppr * 5
                    actor.curHP = updatedHealth
                    actor.maxHP = updatedHealth
                    playerCardProps.onUpdate(actor)
                }}
            />
            <PrestigePicker 
                key={`${actor.name}speedpr`}
                label="Speed Prestige Level"
                level={actor.speed - 10}
                onUpdate={(speedpr) => {
                    actor.speed = 10 + speedpr
                    playerCardProps.onUpdate(actor)
                }}
            />
            <PrestigePicker 
                key={`${actor.name}attackpr`}
                level={actor.attackMax - 10}
                label="Attack Prestige Level"
                onUpdate={(attackpr) => {
                    actor.attackMin = 1 + attackpr
                    actor.attackMax = 10 + attackpr
                    playerCardProps.onUpdate(actor)
                }}
            />
            <ItemPicker 
                key={`${actor.name}${playerCardProps.index}item1`} 
                defaultItem={ playerCardProps.actor.items[0] }
                onUpdate={(kind, tier) => {
                    if (ItemKind[kind] === ItemKind.NONE) {
                        actor.items[0] = undefined
                    } else {
                        const itemKind = Items.itemKindMap[kind] ? Items.itemKindMap[kind] : Items.itemKindMap[ItemKind[kind]]
                        const newItem = new itemKind(tier)
                        actor.items[0] = newItem
                    }

                    playerCardProps.onUpdate(actor)
                }}
            />
            <ItemPicker 
                key={`${actor.name}${playerCardProps.index}item2`} 
                defaultItem={ playerCardProps.actor.items[1] }
                onUpdate={(kind, tier) => {
                    if (ItemKind[kind] === ItemKind.NONE) {
                        actor.items[1] = undefined
                    } else {
                        const itemKind = Items.itemKindMap[kind] ? Items.itemKindMap[kind] : Items.itemKindMap[ItemKind[kind]]
                        const newItem = new itemKind(tier)
                        actor.items[1] = newItem
                    }

                    playerCardProps.onUpdate(actor)
                }}
            />
            <ItemPicker 
                key={`${actor.name}${playerCardProps.index}item3`} 
                defaultItem={ playerCardProps.actor.items[2] }
                onUpdate={(kind, tier) => {
                    if (ItemKind[kind] === ItemKind.NONE) {
                        actor.items[2] = undefined
                    } else {
                        const itemKind = Items.itemKindMap[kind] ? Items.itemKindMap[kind] : Items.itemKindMap[ItemKind[kind]]
                        const newItem = new itemKind(tier)
                        actor.items[2] = newItem
                    }

                    playerCardProps.onUpdate(actor)
                }}
            />
            <ItemPicker 
                key={`${actor.name}${playerCardProps.index}item4`} 
                defaultItem={ playerCardProps.actor.items[3] }
                onUpdate={(kind, tier) => {
                    if (ItemKind[kind] === ItemKind.NONE) {
                        actor.items[3] = undefined
                    } else {
                        const itemKind = Items.itemKindMap[kind] ? Items.itemKindMap[kind] : Items.itemKindMap[ItemKind[kind]]
                        const newItem = new itemKind(tier)
                        actor.items[3] = newItem
                    }

                    playerCardProps.onUpdate(actor)
                }}
            />
        </Card>
    )
  }