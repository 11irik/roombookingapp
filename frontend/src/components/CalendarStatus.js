import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
}));

export default function CalendarStatus(props) {
    const classes = useStyles();

    const busyLabel = 'Занят';
    const busyColor = 'secondary';

    const freeLabel = 'Свободен';
    const freeColor = 'primary';

    let label = busyLabel;
    let color = busyColor;

    if (props.status) {
        color = freeColor;
        label = freeLabel;
    }

    return (
        <div className={classes.root}>
            <Chip
                href={props.link}
                target="_blank"
                label={label}
                clickable
                component="a"
                color={color}
            />
        </div>
    );
}