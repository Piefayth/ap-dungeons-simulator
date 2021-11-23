import { RouteComponentProps, useNavigate } from '@reach/router'
import React, { useState } from 'react'
import { Button, Row, Col } from 'antd'
import { SimulationResult } from '../../../simulator/src/simulator'
import { ArrowLeftOutlined, ArrowRightOutlined, CloseOutlined } from '@ant-design/icons'
import { ActorSummary, ActorSummaryHeader } from './actorSummary'

type SimulationViewState = {
    currentTrial: number,
    currentTurn: number,
}

export function SimulationView(props: RouteComponentProps) {
    const result = props.location.state as SimulationResult
    const navigate = useNavigate()
    
    const [viewState, setViewState] = useState({
        currentTrial: 0,
        currentTurn: 0
    })

    /*
        components
            trial selection *
            turn selection *
            parties display
                maybe one component for each party
                then one component for each actor
            combat message display
    */

    return (
        <>
            <div style={{marginTop: 20, marginLeft: 20}}>
                <Button type="primary" onClick={() => {
                    navigate('./', {
                        state: {
                            party: result.party
                        }
                    })
                }}>
                    <CloseOutlined />
                </Button>
            </div>

            <div style={{margin: 20}}>
                <Row>
                    <Col span={9} />

                    <Col span={2}>
                        <Button type="primary" onClick={() => {
                            if (viewState.currentTrial <= 0) return

                            setViewState({
                                currentTurn: 0,
                                currentTrial: viewState.currentTrial - 1
                            })
                        }}>
                            <ArrowLeftOutlined />
                        </Button>
                    </Col>
                    <Col style={{textAlign: 'center'}}span={2}>
                        {`Trial ${viewState.currentTrial + 1} / ${result.trials}`}
                    </Col>
                    <Col span={2}>
                        <Button 
                            style={{float: 'right'}}
                            type="primary" 
                            onClick={() => {
                                if (viewState.currentTrial + 1 >= result.trials) return

                                setViewState({
                                    currentTurn: 0,
                                    currentTrial: viewState.currentTrial + 1
                                })
                            }}
                        >
                            <ArrowRightOutlined />
                        </Button>
                    </Col>

                    <Col span={9} />
                </Row>
            </div>

            <div style={{margin: 20}}>
                <Row>
                    <Col span={10} />

                    <Col span={1}>
                        <Button type="primary" onClick={() => {
                            if (viewState.currentTurn <= 0) return

                            setViewState({
                                ...viewState,
                                currentTurn: viewState.currentTurn - 1,
                            })
                        }}>
                            <ArrowLeftOutlined />
                        </Button>
                    </Col>
                    <Col style={{textAlign: 'center'}}span={2}>
                        {`Turn ${viewState.currentTurn + 1} / ${result.results[viewState.currentTrial].turnPartyStates.length}`}
                    </Col>
                    <Col span={1}>
                        <Button 
                            style={{float: 'right'}}
                            type="primary" 
                            onClick={() => {
                                if (viewState.currentTurn + 1 >= result.results[viewState.currentTrial].turnPartyStates.length) return

                                setViewState({
                                    ...viewState,
                                    currentTurn: viewState.currentTurn + 1,
                                })
                            }}
                        >
                            <ArrowRightOutlined />
                        </Button>
                    </Col>

                    <Col span={10} />
                </Row>
            </div>

            <div style={{margin: '0 auto', padding: 10, marginTop: 50, maxWidth: 800}}>
                {
                    result.results[viewState.currentTrial].turnPartyStates[viewState.currentTurn].map((party, partyIndex) => {
                        return (
                            <div key={partyIndex + 'actors'} style={{marginTop: 50}}>
                                <ActorSummaryHeader key={partyIndex}/>
                                { party.map((actor, actorIndex) => {
                                    return (
                                        <ActorSummary
                                            key={partyIndex + '-' + actor.name}
                                            actor={actor}
                                        />
                                    )
                                })}

                            </div>
                        )
                    })
                }
            </div>

            <div style={{margin: '0 auto', padding: 10, marginTop: 50, maxWidth: 800}}>
                {
                    result.results[viewState.currentTrial].turnOutput[viewState.currentTurn].map((message, messageIndex) => {
                        return (
                            <Row key={messageIndex + 'msgoutput'}>
                                { message }
                            </Row>
                        )
                    })
                }
            </div>
        </>
    )
}