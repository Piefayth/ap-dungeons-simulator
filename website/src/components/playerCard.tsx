import { Actor } from '../../../simulator/src/engine/actor'
import { Item } from '../../../simulator/src/engine/item'
import { ItemKind } from '../../../simulator/src/engine/itemTypes'
import * as Items from '../../../simulator/src/items'
import React, { useState } from 'react'
import { Card, Form, Input, Select, Row, Col } from 'antd'

type PlayerCardProps = {
    onUpdate: (actor: Actor) => void,
    actor: Actor
}

type PrestigePickerProps = {
    label: string
    name: string
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
                    onChange = { newValue => namePickerProps.onUpdate(newValue.target.value) }
                />
            </Form.Item>
        </Col>

    </Row>

const PrestigePicker = (prestigePickerProps: PrestigePickerProps) =>
    <Row>
        <Col span={19}>
            { prestigePickerProps.label }
        </Col>

        <Col span={1}></Col>

        <Col span={4}>
            <Form.Item name={prestigePickerProps.name}>
                <Select 
                    defaultValue={0}
                    onChange = { (newValue) => prestigePickerProps.onUpdate(newValue)}
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
            <NamePicker 
                defaultName={ playerCardProps.actor.name }
                onUpdate={(updatedName) => {
                    actor.name = updatedName
                    playerCardProps.onUpdate(actor)
                }}
            />
            <PrestigePicker 
                name="hppr" 
                label="HP Prestige Level"
                key={`${actor.name}hppr`}
                onUpdate={(hppr) => {
                    const updatedHealth = 100 + hppr * 5
                    actor.curHP = updatedHealth
                    actor.maxHP = updatedHealth
                    playerCardProps.onUpdate(actor)
                }}
            />
            <PrestigePicker 
                name="speedpr" 
                key={`${actor.name}speedpr`}
                label="Speed Prestige Level"
                onUpdate={(speedpr) => {
                    actor.speed = 10 + speedpr
                    playerCardProps.onUpdate(actor)
                }}
            />
            <PrestigePicker 
                name="attackpr"
                key={`${actor.name}attackpr`}
                label="Attack Prestige Level"
                onUpdate={(attackpr) => {
                    actor.attackMin = 1 + attackpr
                    actor.attackMax = 10 + attackpr
                    playerCardProps.onUpdate(actor)
                }}
            />
            <ItemPicker 
                key={`${actor.name}item1`} 
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
                key={`${actor.name}item2`} 
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
                key={`${actor.name}item3`} 
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
                key={`${actor.name}item4`} 
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