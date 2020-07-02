import React from 'react';
import EventList from "./EventList";
import './App.css';
import Grid from "@material-ui/core/Grid";
import DatePicker from "./DatePicker";
import CalendarLink from "./CalendarLink";

const CALENDAR_LINK = 'https://calendar.google.com/calendar?cid=MXQ0NDRob24wdTE1cGkxOWlyYzUxaTgxb3NAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ';//todo

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            start: new Date()
        }
    }

    componentDidMount() {
        fetch("http://localhost:5000/api/calendar/", {
            method: 'POST',
            body: JSON.stringify(this.state.start)
        }) //todo move to prop file
            .then(res => res.json())
            .then(json => {
                this.setState({events: json})
            });
    }

    async componentDidUpdate(prevProps, prevState) {
        if (this.state.start !== prevState.start) {
            let data = {start: this.state.start};

            //todo move to prop file
            await fetch("http://192.168.88.254:5000/api/calendar/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(json => {
                    this.setState({events: json});
                });
        }
    }

    handleDate = (date) => {
        this.setState({start: date});
    };

    render() {
        return (
                <div style={{
                    padding: 20,
                    flexGrow: 1,
                }}>
                    <Grid container spacing={1}>
                        <Grid item xs>
                            <CalendarLink link={CALENDAR_LINK}/>
                        </Grid>
                        <Grid item xs>
                            <p>Events</p>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs>
                            <DatePicker onSelectDate={this.handleDate}/>
                        </Grid>
                        <Grid item xs>
                            <EventList events={this.state.events}/>
                        </Grid>
                    </Grid>
                </div>
        )
    }
}

export default App;
