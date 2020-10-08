import React, {Fragment} from "react";
import {DatePicker} from "@material-ui/pickers";

export default function BasicDatePicker(props) {
    return (
        <Fragment>
            <DatePicker
                value={props.date}
                onChange={props.onSelectDate}
                animateYearScrolling
            />
        </Fragment>
    );
}