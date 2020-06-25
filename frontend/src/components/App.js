import React from 'react';
import EventList from "./EventList";
import './App.css';

function App() {
    let events = [
        {
            "description": "Room 312",
            "start": "2020-07-25",
            "end": "2020-07-26",
        },
        {
            "description": "Room 311",
            "start": "2020-07-27",
            "end": "2020-07-29",
        }
    ];

    return (
        <div className='list-container'>
            <EventList events={events}/>
        </div>
    )
}

export default App;
