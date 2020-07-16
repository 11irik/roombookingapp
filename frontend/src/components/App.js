import React from 'react';
import EventList from "./EventList";
import './App.css';
import Grid from "@material-ui/core/Grid";
import DatePicker from "./DatePicker";
import CalendarSelect from "./CalendarSelect";
import CalendarStatus from "./CalendarStatus";


const HOST = process.env.REACT_APP_HOST;
const API_CALENDAR = process.env.REACT_APP_CALENDAR_API;
const API_EVENT = process.env.REACT_APP_EVENT_API;

//todo
const API_EVENT_GENERATE_ID = 'api/event/generateId/';



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
        //todo timer, check its length and also count and place of requests
        this.interval = setInterval(() => this.fetchCalendars().then(() => this.fetchEvents().then(() => this.getRoomStatus())), 15000);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.start !== prevState.start) {
            this.fetchEvents().then(() => this.getRoomStatus());
        }

        if (this.state.calendar !== prevState.calendar) {
            this.fetchEvents().then(() => this.getRoomStatus());
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        this.abortController.abort();
    }

    async fetchCalendars() {
        let url = HOST + API_CALENDAR;

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
        let url = new URL(HOST + API_CALENDAR + this.state.calendar.id);
        let params = [['start', this.state.start.toISOString()]];
        url.search = new URLSearchParams(params).toString();


        await fetch(url, {signal: this.abortController.signal})
            .then(res => res.json())
            .then(events => {
                events.sort((a, b) => a.end.dateTime > b.end.dateTime ? 1 : -1);
                this.setState({
                    events: events,
                })
            })
            .catch(error => {
                if (error.name === 'AbortError') {
                    //todo
                }
            });
    }

    async updateEvent(event) {
        let url = new URL(HOST + API_EVENT);
        fetch(url, {
            method: 'PUT',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(event)
        })
            .then(
                res => console.log(res),
                err => console.log(err),
            )
    }

    async createEventId(event) {
        let url = new URL(HOST + API_EVENT_GENERATE_ID);
        fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(event)
        })
            .then(
                //todo
                res => {},
                err => {},
            )
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

    handleFinish = (calendarId, eventId, startDate) => {
        let firstJanuary = new Date();
        firstJanuary.setDate(1);
        firstJanuary.setMonth(0);

        console.log(firstJanuary)

        startDate = new Date(firstJanuary);
        console.log(startDate)

        let event = {
            "calendarId": calendarId,
            "eventId": eventId,
            "resource": {
                "start": {
                    "dateTime": startDate
                },
                "end": {
                    'dateTime': firstJanuary
                }
            }
        };

        this.updateEvent(event).then(x => {
            let eventIndex = this.state.events.findIndex(x => x.id === eventId);
            let changedEvents = this.state.events.concat();
            changedEvents.splice(eventIndex, 1);
            this.setState({events: changedEvents})
        });
    };

    handleExtend = (calendarId, eventId, endDate) => {
        endDate = new Date(endDate);
        endDate.setDate(endDate.getDate() + 1);

        let event = {
            "calendarId": calendarId,
            "eventId": eventId,
            "resource": {
                "end": {
                    'dateTime': endDate
                }
            }
        };

        this.updateEvent(event).then(x => {
            let changedEvents = this.state.events.concat();
            changedEvents.map(x => x.id === eventId ? x.end.dateTime = endDate : {});
            this.setState({events: changedEvents})
        });
    };

    handleGenerateEventId = (event) => {


        this.createEventId(event).then(x => {

        });
    };

    render() {
        let eventListComponent;
        eventListComponent =
            <EventList date={this.state.start} events={this.state.events} handleExtend={this.handleExtend} handleFinish={this.handleFinish} handleGenerateEventId={this.handleGenerateEventId}/>
        return (
            <div>
                <Grid>
                    {eventListComponent}
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
