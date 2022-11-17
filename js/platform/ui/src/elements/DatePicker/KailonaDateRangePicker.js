import React, { Component } from 'react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { withStyles } from '@material-ui/core';
import DateRangePicker from './lib/DateRangePicker';
import './KailonaDatePicker.css';

const CustomDateRangePicker = withStyles({
    root: {
        border: '1px solid red',
    },
})(DateRangePicker);

const styles = {
    datepicker: {
        '& input, & input:hover': {
            border: 'none !important',
        },
    },
};

const DATE_FORMAT = 'MMM d, yyyy';

class KailonaDateRangePicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dateFormat: this.props.dateFormat || DATE_FORMAT,
            date: this.props.date,
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
        const { classes } = this.props;

        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <CustomDateRangePicker
                    variant="inline"
                    className={classes.datepicker}
                    format={this.state.dateFormat}
                    id={this.props.id}
                    value={this.state.date}
                    placeholder={t('ehr', 'Select Date')}
                    onChange={this.handleChange}
                    maxDate={this.props.maxDate}
                    KeyboardButtonProps={{
                        'aria-label': this.props.ariaLabel,
                    }}
                    autoOk={true}
                />
            </MuiPickersUtilsProvider>
        );
    }
}

export default withStyles(styles)(KailonaDateRangePicker);
