import React from "react";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import BlockIcon from '@material-ui/icons/Block';

class Event extends React.Component {
    render() {
        return (
            <ListItem button>
                <ListItemIcon>
                    <BlockIcon />
                </ListItemIcon>
                <ListItemText primary={this.props.data.description} secondary={this.props.data.start}/>
            </ListItem>
        );
    }
}

export default Event;