import React  from "react"
import { connect } from 'react-redux'
import {Row, Col, Button} from "react-bootstrap"
import { useStaticQuery, graphql } from 'gatsby'

import Layout from "../components/layout"
import ChangeName from "../components/controls/change_name"
import {nextSeason, makeChoice} from "../util/event_director"


function IndexPage({player, events, dispatch} ) {

    const data  = useStaticQuery( graphql`{
        events: allMarkdownRemark(
            sort: {
              fields: [frontmatter___age]
              order: ASC
            }
        ){
            nodes {
                id
            }
        }
    }`)

    const currentEvent = events.activeEvent

    let nextSeasonControl = <>
        <Col lg={9} sm={6}/>
        <Col lg={3} sm={6}><Button type="button"  size="lg"  onClick={ ()=>{nextSeason(player, data.events.nodes, dispatch)} }>Next Season</Button></Col>
    </>


    if(currentEvent?.input === "name"){
        nextSeasonControl = <ChangeName/>
    }
    else if(currentEvent?.choices?.length){
        nextSeasonControl = currentEvent.choices.map((choice,index) => <Col lg={3} sm={6} key={index}>
            <Button type="button"  size="lg"  onClick={ ()=>{makeChoice(currentEvent,index,dispatch)} } >{choice.label}</Button>
        </Col>
        )
    }

    return (
        <Layout active={"game"}>

            <h1>{currentEvent.title}</h1>

            { currentEvent.parts.map((event,index) => <div key={index}>{event}</div>)}

            <div className="gamecontrols">
                {currentEvent.prompt && <h3>{currentEvent.prompt}</h3>}

                <Row>{nextSeasonControl}</Row>
            </div>

        </Layout>
    )
}

export default connect(state => ({
        events: state.events,
        player: state.player,
    }), null)(IndexPage)

