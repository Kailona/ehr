import React, { Component } from 'react';
import { Grid as MuiGrid, withStyles, Link as MuiLink } from '@material-ui/core';
import DateRangeEnum from '@kailona/core/src/enums/DateRange.enum';
import { ProfileManager } from '@kailona/core';

const Grid = withStyles({
    root: {
        margin: '0 5px',
    },
})(MuiGrid);

const Link = withStyles(theme => ({
    root: {
        color: theme.palette.gray40.main,
        '&:hover': {
            textDecoration: 'none',
            color: theme.palette.primary.main,
        },
        '&.active': {
            color: theme.palette.primary.main,
        },
    },
}))(MuiLink);

export default class TimeRangeFilter extends Component {
    constructor(props) {
        super(props);
    }

    handleDateRangeChange(dateRange) {
        if (typeof this.props.handleDateRangeChange === 'function') {
            return this.props.handleDateRangeChange(dateRange);
        }
    }

    render() {
        const patientDob = ProfileManager && ProfileManager.activeProfile && ProfileManager.activeProfile.patientDob;

        // Hide MAX if birth date was not entered
        const dateRanges = Object.values(DateRangeEnum).filter(r => r !== DateRangeEnum.MAX || !!patientDob);

        return (
            <Grid container style={{ justifyContent: 'flex-end' }}>
                {dateRanges.map((dateRange, index) => (
                    <Grid key={index} item>
                        <Link
                            href="#"
                            className={this.props.dateRange === dateRange ? 'active' : ''}
                            onClick={() => this.handleDateRangeChange(dateRange)}
                        >
                            {dateRange}
                        </Link>
                    </Grid>
                ))}
            </Grid>
        );
    }
}
