import React, { Component } from 'react';
import { MuiPickersUtilsProvider, KeyboardDatePicker as MuiKeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { withStyles } from '@material-ui/core';
import KailonaTextField from '../TextField/KailonaTextField';
import './KailonaDatePicker.css';

const KeyboardDatePicker = withStyles(theme => ({
    root: {
        '& .MuiPaper-root': {
            borderRadius: '100px',
            boxShadow: '10px 10px 5px 0px rgba(0,0,0,0.75);',
        },
        '& input': {
            color: `${theme.palette.primary.main} !important`,
            border: 'none !important',
        },
        '& .MuiButtonBase-root': {
            backgroundColor: 'transparent !important',
            border: 'none !important',

            '&:hover': {
                backgroundColor: 'transparent !important',
            },
        },
    },
}))(MuiKeyboardDatePicker);

const DATE_FORMAT = 'MMM d, yyyy';

export default class KailonaDatePicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dateFormat: this.props.dateFormat || DATE_FORMAT,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        if (this.props.defaultValue) {
            this.setState({
                date: this.props.defaultValue,
            });
        }
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
                <KeyboardDatePicker
                    variant="inline"
                    format={this.state.dateFormat}
                    id={this.props.id}
                    value={this.state.date || null}
                    placeholder={this.props.ariaLabel}
                    onChange={this.handleChange}
                    KeyboardButtonProps={{
                        'aria-label': this.props.ariaLabel,
                    }}
                    TextFieldComponent={props => <KailonaTextField {...props} inputRef={this.props.inputRef} />}
                    autoOk={true}
                    disableFuture={this.props.disableFuture}
                    openTo={this.props.openTo}
                    fullWidth={this.props.fullWidth}
                />
            </MuiPickersUtilsProvider>
        );
    }
}
