import React from 'react';
import EventList from "./EventList";
import './App.css';
import Grid from "@material-ui/core/Grid";
import DatePicker from "./DatePicker";
import CalendarSelect from "./CalendarSelect";
import CalendarStatus from "./CalendarStatus";

//todo move to prop file
// const ADDRESS = 'http://5.165.197.32:5000/';
const ADDRESS = 'http://localhost:5000/';
const API = 'api/calendar/';

const Background = 'url(https://lh3.googleusercontent.com/GUOYVJC9WrBIzjwcZ9GLhr62YNyF-Y__C-XkfmWdes7SU3zidyA6cvRXKt10UlcEI4aGEuKlMmwUE0uWHJlFuSJWO8Nt85rZim54bRo=w0)'

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
        let currentTime = new Date();
        let isFree = true;
        this.state.events.map(x => {
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
                // backgroundImage: Background,
                padding: 20,
                flexGrow: 1,
                height: '100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundColor: 'black',
            }}>

                <Grid item xs style={{backgroundColor: 'black'}}>
                    <EventList events={this.state.events}/>
                </Grid>

                <div className={'flexbox-container'} style={{
                    position: 'fixed',
                    bottom: '20px'
                }}>
                    <CalendarSelect
                        calendar={this.state.calendar}
                        onSelectCalendar={this.handleCalendar}
                        calendars={this.state.calendars}
                    />

                    <DatePicker date={this.state.start} onSelectDate={this.handleDate}/>


                    <CalendarStatus status={this.state.status} link={this.state.calendar.link}/>
                </div>

            </div>
        )
    }
}

export default App;
