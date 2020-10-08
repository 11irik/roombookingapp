import React, {Fragment} from "react";
import List from '@material-ui/core/List';
import Event from "./Event";
import {makeStyles, withStyles} from '@material-ui/core/styles'


const useStyles = makeStyles((theme) => ({
    root: {
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
    },
    listColor: {
        backgroundColor: 'white',
    },
}));

export default function EventList(props) {
    const classes = useStyles();

    return (
        <Fragment>
            <List className={classes.listColor}>
                {props.events.map(x => <Event key={x.id} data={x}/>)}
            </List>
        </Fragment>
    )
}
