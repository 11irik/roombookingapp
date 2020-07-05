import React from 'react';
import EventList from "./EventList";
import './App.css';
import Grid from "@material-ui/core/Grid";
import DatePicker from "./DatePicker";
import CalendarLink from "./CalendarLink";
import CalendarSelect from "./CalendarSelect";

//todo move to prop file
const ADDRESS = 'http://192.168.88.254:5000/';
const API = 'api/calendar/';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            calendars:
                [],
            start: new Date(),
            calendar: {}
        }
    }

    abortController = new window.AbortController();

    componentDidMount() {
        this.fetchCalendars().then(() => this.fetchEvents());
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.start !== prevState.start) {
            this.fetchEvents()
        }

        if (this.state.calendar !== prevState.calendar) {
            this.fetchEvents()
        }
    }

    componentWillUnmount = () => this.abortController.abort();

    async fetchCalendars() {
        let url = ADDRESS + API;

        let noData = {
            link: 'nodata',
            id: 'nodata',
            name: 'nodata',
        };

        let a = [];
        a.push(noData);

        await fetch(url)
            .then(res => res.json())
            .then(calendars => {
                if (calendars.length !== 0) {
                    this.setState({
                        calendars: calendars,
                        calendar: calendars[0],
                    })
                } else {
                    this.setState({
                        calendar: noData,
                        calendars: a
                    });
                }
            })
            .catch(error => {
                if (error.name === 'AbortError') {
                    this.setState({
                        calendar: noData,
                        calendars: a
                    });
                }
            });
    }

    fetchEvents() {
        let url = new URL(ADDRESS + API + this.state.calendar.id);
        let params = [['start', this.state.start.toISOString()]];
        url.search = new URLSearchParams(params).toString();

        let noEvents = {
            id: '1',
            htmlLink: 'noEvent',
            summary: 'No events',
            start: {
                dateTime: '1970-01-01T00:00:00+04:00'
            },
            end: {
                dateTime: '1970-01-01T00:00:00+04:00'
            },
        };

        let defaultEventList = [];
        defaultEventList.push(noEvents);

        fetch(url, {signal: this.abortController.signal})
            .then(res => res.json())
            .then(events => {
                if (events.length !== 0) {
                    this.setState({
                        events: events,
                    })
                } else {
                    this.setState({
                        events: defaultEventList,
                    });
                }
            })
            .catch(error => {
                if (error.name === 'AbortError') {
                    this.setState({events: defaultEventList})
                }
            });
    }

    handleDate = (date) => {
        this.setState({start: date});
    };

    handleCalendar = (calendar) => {
        this.setState({calendar: calendar});
    };

    render() {
        return (
            <div style={{
                padding: 20,
                flexGrow: 1,
            }}>
                <Grid container spacing={1}>
                    <Grid item xs>
                        <CalendarSelect calendar={this.state.calendar} onSelectCalendar={this.handleCalendar}
                                        calendars={this.state.calendars}/>
                        <CalendarLink link={this.state.calendar.link} name={'Link'}/>
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
