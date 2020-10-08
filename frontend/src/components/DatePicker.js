import React, { useState } from "react";
import lightBlue from "@material-ui/core/colors/lightBlue";
import { DatePicker } from "@material-ui/pickers";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

const materialTheme = createMuiTheme({
    overrides: {
        MuiInputBase: {
            input: {
                color: "white"
            }
        }
    },
});

export default function BasicDatePicker(props) {
    return (
        <ThemeProvider theme={materialTheme}>
            <DatePicker
                value={props.date}
                onChange={props.onSelectDate}
                animateYearScrolling={false}
            />
        </ThemeProvider>
    );
}