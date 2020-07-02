import React from "react";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AlarmIcon from '@material-ui/icons/Alarm';

class Event extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            summary: props.data.summary,
            startDate: new Date(props.data.start.dateTime),
            endDate: new Date(props.data.end.dateTime),
        }
    }

    getTime(date) {
        return date.getHours() + ':' + date.getMinutes()
    }

    render() {
        return (
            <ListItem button component='a' target="_blank" href={this.props.data.htmlLink}>
                <ListItemIcon>
                    <AlarmIcon />
                </ListItemIcon>
                <ListItemText primary={this.state.summary} secondary={this.getTime(this.state.startDate) + "-" + this.getTime(this.state.endDate)}/>
            </ListItem>
        );
    }
}

export default Event;