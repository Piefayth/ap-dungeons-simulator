import React from 'react'
import { Actor } from "../../../simulator/src/engine/actor"
import { Row, Col } from 'antd'

type ActorSummaryProps = {
    actor: Actor
}

export function ActorSummaryHeader() {
    return (
        <>
            <Row>
                <Col span={8}>
                    Name
                </Col>
                <Col span={4}>
                    HP
                </Col>
                <Col span={4}>
                    Speed
                </Col>
                <Col span={4}>
                    Attack
                </Col>
                <Col span={4}>
                    Energy
                </Col>
            </Row>
        </>
    )
}

export function ActorSummary(props: ActorSummaryProps) {
    return (
        <>
            <Row>
                <Col span={8}>
                    {props.actor.name}
                </Col>
                <Col span={4}>
                    {`${props.actor.curHP} / ${props.actor.maxHP}`}
                </Col>
                <Col span={4}>
                    {props.actor.speed}
                </Col>
                <Col span={4}>
                    {`${props.actor.attackMin} - ${props.actor.attackMax}`}
                </Col>
                <Col span={4}>
                    {props.actor.energy}
                </Col>
            </Row>
        </>
    )
}