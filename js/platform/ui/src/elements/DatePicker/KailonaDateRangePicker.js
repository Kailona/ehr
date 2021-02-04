import React, { Component } from 'react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { withStyles } from '@material-ui/core';
import DateRangePicker from './lib/DateRangePicker';

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
        };

        this.datePickerRef = React.createRef();
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        if (this.props.defaultValue) {
            this.setState({
                date: new Date(),
            });
        }
        const today = new Date();
        const end = today.setDate(today.getDate() + 10);

        this.handleChange({
            begin: new Date().getDate(),
            end,
        });
    }

    handleChange(date) {
        console.log(' DATE ', date);
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
                    ref={this.datePickerRef}
                    variant="inline"
                    className={classes.datepicker}
                    format={this.state.dateFormat}
                    id={this.props.id}
                    value={this.state.date}
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
