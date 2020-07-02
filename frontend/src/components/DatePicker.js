import React, {Fragment, useEffect, useState} from "react";
import {DatePicker} from "@material-ui/pickers";

export default function BasicDatePicker(props) {
    let [selectedDate, handleDateChange] = useState(new Date());

    useEffect(() => {
        props.onSelectDate(selectedDate);
    }, [selectedDate]);

    return (
        <Fragment>
            <DatePicker
                label="Date"
                value={selectedDate}
                onChange={handleDateChange}
                animateYearScrolling
            />
        </Fragment>
    );
}