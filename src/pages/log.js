import React  from "react"
import { connect } from 'react-redux'
import PageLayout from "../components/page_layout"


function getEvent(events){
    const eventList = []

    for (const [index, e] of events.entries()) {
        if(e.flavor_text)
            eventList.push(<li key={index}>{e.flavor_text} <b>({e.effect_text})</b></li>)
        else
            eventList.push(<li key={index}><b>({e.effect_text})</b></li>)
    }

    return eventList
}

function LogPage({events, dispatch}) {

    return (
        <PageLayout active={"log"}>
            <ul>
                {getEvent(events.recentEvents)}
            </ul>
        </PageLayout>
    )
}


export default connect(state => ({
        events: state.events
    }), null)(LogPage)

