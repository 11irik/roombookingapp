import React from 'react';
import EventList from "./EventList";
import './App.css';
import Grid from "@material-ui/core/Grid";
import DatePicker from "./DatePicker";
import CalendarSelect from "./CalendarSelect";
import CalendarStatus from "./CalendarStatus";

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
            calendar: {},
            isFree: '',
        }
    }

    abortController = new window.AbortController();

    componentDidMount() {
        this.fetchCalendars().then(() => this.fetchEvents().then(() => this.getRoomStatus()));
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.start !== prevState.start) {
            this.fetchEvents().then(() => this.getRoomStatus());
        }

        if (this.state.calendar !== prevState.calendar) {
            this.fetchEvents().then(() => this.getRoomStatus());
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

    async fetchEvents() {
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

        await fetch(url, {signal: this.abortController.signal})
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

    getRoomStatus() {
        let currentTime =  new Date();
        let isFree = true;
        this.state.events.map(x =>
        {
            if (new Date(x.start.dateTime) < currentTime && new Date(x.end.dateTime) > currentTime) {
                isFree = false;
            }
        });

        this.setState({status: isFree})
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
                        <div class={'flexbox-container'}>
                            <CalendarSelect
                                calendar={this.state.calendar}
                                onSelectCalendar={this.handleCalendar}
                                calendars={this.state.calendars}
                            />
                            <CalendarStatus status={this.state.status} link={this.state.calendar.link}/>
                        </div>
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
