import React from "react";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/styles';


const styles = theme => ({
    whiteBackgroundColor: {
        backgroundColor: 'black',
    },
    grayBackgroundColor: {
        backgroundColor: '#142584'
    },
    primary:{
        fontSize:'450%',
        textAlign: 'center',
        color: 'white'
    },
    secondary:{
        fontSize:'350%',
        textAlign: 'center',
        color: 'white'
    }
});

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
        return ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2)
    }

    render() {
        const { classes } = this.props;
        let color;

        if (this.props.colorChange) {
            color = classes.grayBackgroundColor;
        } else {
            color = classes.whiteBackgroundColor;
        }

        return (
            <ListItem style={{backgroundColor: 'black'}} button component='a' target="_blank" href={this.props.data.htmlLink}>
                <ListItemText className={color} classes={{primary:classes.primary, secondary:classes.secondary}} primary={this.state.summary} secondary={this.getTime(this.state.startDate) + "-" + this.getTime(this.state.endDate)}/>
            </ListItem>
        );
    }
}

export default withStyles(styles)(Event);