import React from "react";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/styles';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Divider from '@material-ui/core/Divider';

import CheckIcon from '@material-ui/icons/Check';

const styles = theme => ({
    firstButton: {
        backgroundColor: 'black',
        '&:hover': {
            backgroundColor: 'gray',
        },
        color: 'white'
    },
    secondButton: {
        backgroundColor: '#142584',
        '&:hover': {
            backgroundColor: 'gray',
        },
        color: 'white'
    },
    iconButton: {
        '&:hover': {
            backgroundColor: 'gray',
        },
        color: 'white'
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
    },
});

const MONTH_LIST = [ "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря" ];
const DAY_LIST = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];


class Event extends React.Component {
    constructor(props) {
        super(props);
    }

    getMonth(date) {
        return (MONTH_LIST[date.getMonth()]);
    }

    getDate(date) {
        return (date.getDate());
    }

    getDay(date) {
        return (DAY_LIST[date.getDay()]);
    }

    getDayString(date) {
        return this.getDate(date) + ' ' + this.getMonth(date) + ', ' + this.getDay(date);
    }

    render() {
        const { classes } = this.props;
        let color;

        if (this.props.colorChange) {
            color = classes.secondButton;
        } else {
            color = classes.firstButton;
        }

        return (
            <ListItem classes={{button: color}} button component='a' target="_blank" href={this.props.data.htmlLink} >
                <ListItemText classes={{primary:classes.primary, secondary:classes.secondary}} primary={this.props.data.summary} secondary={this.getDayString(new Date(this.props.data.end.dateTime))}/>
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" className={classes.iconButton} onClick={() => this.props.onExtend(this.props.data.organizer.email, this.props.data.id, this.props.data.end.dateTime)}>
                        <AccessTimeIcon />
                    </IconButton>
                    <Divider/>
                    <IconButton edge="end" aria-label="delete" className={classes.iconButton} onClick={() => this.props.onFinish(this.props.data.organizer.email, this.props.data.id, this.props.data.start.dateTime)}>
                        <CheckIcon />
                    </IconButton>
                </ListItemSecondaryAction>

            </ListItem>
        );
    }
}

export default withStyles(styles)(Event);