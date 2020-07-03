import React from 'react';
import List from '@material-ui/core/List';
import Event from "./Event";

class EventList extends React.Component {
    render() {
        return (
            <div>
                <List>
                    {this.props.events.map(x =>  <Event key = {x.id} data={x}/>)}
                </List>
            </div>
        )
    }
}

export default EventList;