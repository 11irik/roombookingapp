import React from 'react';
import EventList from "./EventList";
import './App.css';
import Grid from "@material-ui/core/Grid";
import DatePicker from "./DatePicker";
import CalendarLink from "./CalendarLink";

const CALENDAR_LINK = 'https://calendar.google.com/calendar?cid=MXQ0NDRob24wdTE1cGkxOWlyYzUxaTgxb3NAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ';//todo
const ADDRESS = 'http://192.168.88.254:5000'; //todo move to prop file
const API = '/api/calendar';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            start: new Date()
        }
    }

    abortController = new window.AbortController();

    componentDidMount() {
        let url = new URL(ADDRESS + API);
        let params = [['start', this.state.start.toISOString()]];
        url.search = new URLSearchParams(params).toString();

        //todo move to prop file
        fetch(url)
            .then(res => res.json())
            .then(json => {
                this.setState({events: json});
            });
    }

    componentDidUpdate() {
        let url = new URL(ADDRESS + API);
        let params = [['start', this.state.start.toISOString()]];
        url.search = new URLSearchParams(params).toString();

        fetch(url, {signal: this.abortController.signal})
            .then(res => res.json())
            .then(json => {
                this.setState({events: json});
            })
            .catch(error => {
                if (error.name === 'AbortError') return;
                throw error;
            });
    }

    componentWillUnmount = () => this.abortController.abort();

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
                        <DatePicker date={this.state.start} onSelectDate={this.handleDate}/>
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
