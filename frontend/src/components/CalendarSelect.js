import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function SimpleSelect(props) {
    const classes = useStyles();

    return (
        <div >
            <FormControl className={classes.formControl} >
                <Select
                    style={{color: 'white'}}
                    value={props.calendar}
                    onChange={e => props.onSelectCalendar(e.target.value)}
                >
                    {props.calendars.map(calendar => <MenuItem key={calendar.id} value={calendar}>{calendar.name}</MenuItem>)}
                </Select>
            </FormControl>
        </div>
    );
}