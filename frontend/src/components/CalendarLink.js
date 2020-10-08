import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
    },
}));

export default function CalendarLink(props) {
    const classes = useStyles();

    return (
        <Typography className={classes.root}>
            <Link href={props.link} target="_blank">
                {props.name}
            </Link>
        </Typography>
    );
}