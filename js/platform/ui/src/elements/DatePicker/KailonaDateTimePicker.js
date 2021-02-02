import React, { Component } from 'react';
import { MuiPickersUtilsProvider, KeyboardDateTimePicker as MuiKeyboardDateTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { withStyles } from '@material-ui/core';
import KailonaTextField from '../TextField/KailonaTextField';

const KeyboardDateTimePicker = withStyles({
    root: {
        '& input': {
            border: 'none !important',
        },
    },
})(MuiKeyboardDateTimePicker);

const DATE_TIME_FORMAT = 'MMM d, yyyy, HH:mm';

export default class KailonaDateTimePicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dateTimeFormat: this.props.dateTimeFormat || DATE_TIME_FORMAT,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(date) {
        this.setState({
            date,
        });

        if (this.props.onChange && typeof this.props.onChange === 'function') {
            this.props.onChange(date);
        }
    }
    render() {
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDateTimePicker
                    variant="inline"
                    format={this.state.dateTimeFormat}
                    id={this.props.id}
                    value={this.state.date}
                    placeholder="Date"
                    onChange={this.handleChange}
                    KeyboardButtonProps={{
                        'aria-label': this.props.ariaLabel,
                    }}
                    TextFieldComponent={props => <KailonaTextField {...props} inputRef={this.props.inputRef} />}
                />
            </MuiPickersUtilsProvider>
        );
    }
}
