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
const WEEK_LENGTH = 7;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            expiredEvents: [],
            calendars:
                [],
            start: new Date(),
            today: new Date(),
            calendar: {},
            isFree: '',
            allEvents: []
        }
    }

    abortController = new window.AbortController();

    componentDidMount() {
        this.fetchCalendars()
            .then(() => {
                this.fetchAllEvents()
            })
        ;

        //todo timer, check its length and also count and place of requests
        this.interval = setInterval(() => {
            this.setState({'today': new Date()});
            this.fetchAllEvents()

        }, 15000);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.start !== prevState.start || this.state.calendar !== prevState.calendar) {
            this.fetchAllEvents()
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


    //fixme
    async fetchAllEvents() {
        //todo check if current day is between 1 and 7
        let dayEnd = new Date(this.state.start);
        dayEnd = new Date(dayEnd.setHours(23, 59, 59, 99));
        let weekAgoDate = new Date(this.state.today);
        weekAgoDate.setDate(this.state.today.getDate() - WEEK_LENGTH);

        this.fetchEvents(this.state.start, dayEnd)
            .then(() => {
                this.getRoomStatus();
                this.setState({
                    allEvents: this.state.expiredEvents.concat(this.state.events),
                })
            });
        this.fetchExpiredEvents(weekAgoDate, this.state.today).then(() => {
            this.setState({
                allEvents: this.state.expiredEvents.concat(this.state.events),
            })
        })
    }

    async fetchEvents(start, end) {
        let url = new URL(HOST + API_CALENDAR + this.state.calendar.id);
        let params = [['start', start], ['end', end]];
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

    //todo
    async fetchExpiredEvents(start, end) {
        let url = new URL(HOST + API_CALENDAR + this.state.calendar.id);
        let params = [['start', start], ['end', end]];
        url.search = new URLSearchParams(params).toString();

        await fetch(url, {signal: this.abortController.signal})
            .then(res => res.json())
            .then(events => {
                events = events.filter(event => (new Date(event.end.dateTime) < new Date(this.state.today)));
                events.sort((a, b) => a.end.dateTime > b.end.dateTime ? 1 : -1);
                this.setState({
                    expiredEvents: events
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
                res => {
                },
                err => {
                },
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

        startDate = new Date(firstJanuary);

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
            let eventIndex = this.state.allEvents.findIndex(x => x.id === eventId);
            let changedEvents = this.state.allEvents.concat();
            changedEvents.splice(eventIndex, 1);
            this.setState({allEvents: changedEvents})
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
            let changedEvents = this.state.allEvents.concat();
            changedEvents.map(x => x.id === eventId ? x.end.dateTime = endDate : {});
            this.setState({allEvents: changedEvents})
        });
    };

    handleGenerateEventId = (event) => {
        this.createEventId(event).then(x => {

        });
    };

    render() {
        let eventListComponent;
        eventListComponent =
            <EventList date={this.state.start} events={this.state.allEvents} handleExtend={this.handleExtend}
                       handleFinish={this.handleFinish} handleGenerateEventId={this.handleGenerateEventId}/>;


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