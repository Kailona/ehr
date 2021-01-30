import React, { Component } from 'react';
import { MuiPickersUtilsProvider, KeyboardDatePicker as MuiKeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { withStyles } from '@material-ui/core';

const KeyboardDatePicker = withStyles({
    root: {
        '& input': {
            border: 'none !important',
        },
    },
})(MuiKeyboardDatePicker);

const DATE_FORMAT = 'dd/MM/yyyy';

export default class KailonaDatePicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dateFormat: this.props.dateFormat || DATE_FORMAT,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(date) {
        this.setState({
            date,
        });

        if (this.props.onDateChange && typeof this.props.onDateChange === 'function') {
            this.props.onDateChange(date);
        }
    }
    render() {
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    variant="inline"
                    format={this.state.dateFormat}
                    id={this.props.id}
                    value={this.state.date}
                    placeholder="Date"
                    onChange={this.handleChange}
                    KeyboardButtonProps={{
                        'aria-label': this.props.ariaLabel,
                    }}
                />
            </MuiPickersUtilsProvider>
        );
    }
}
