import React, { Component } from 'react';
import moment from 'moment';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
} from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { Logger } from '@kailona/core';
import { Loader } from '@kailona/ui';
import ActivitiesService from '../services/ActivitiesService';
import getActivityTime from '../helpers/getActivityTime';
import getActivityValue from '../helpers/getActivityValue';

const logger = new Logger('ActivitiesDataModule');

const HeaderTableCell = styled(TableCell)({
    fontWeight: 'bold',
});

export default class ActivitiesDataModule extends Component {
    constructor(props) {
        super(props);

        this.activitiesService = new ActivitiesService();

        this.state = {
            loading: true,
            activities: [],
        };
    }

    componentDidMount = async () => {
        try {
            // Filter by last month (FHIR date/time in UTC)
            const endMoment = moment.utc();
            const startMoment = endMoment.clone().subtract(1, 'month');

            const params = [
                {
                    date: `le${endMoment.format('YYYY-MM-DD')}`,
                },
                {
                    date: `ge${startMoment.format('YYYY-MM-DD')}`,
                },
                {
                    _sort: '-date',
                },
            ];

            const activities = await this.activitiesService.fetchActivities(params);

            this.setState({
                loading: false,
                activities,
            });
        } catch (error) {
            logger.error(error);
        }
    };

    getActivityRows() {
        const { activities } = this.state;

        return activities.map((activity, index) => {
            const activityTime = getActivityTime(activity);
            const { value: distanceValue, unit: distanceUnit } = getActivityValue(
                activity,
                'http://loinc.org',
                '55430-3'
            );
            const { value: caloriesValue, unit: caloriesUnit } = getActivityValue(
                activity,
                'http://loinc.org',
                '55421-2'
            );

            return (
                <TableRow key={index}>
                    <TableCell component="th" scope="row">
                        {activityTime}
                    </TableCell>
                    <TableCell>
                        {distanceValue} {distanceUnit}
                    </TableCell>
                    <TableCell>
                        {caloriesValue} {caloriesUnit}
                    </TableCell>
                </TableRow>
            );
        });
    }

    render() {
        const { loading } = this.state;
        const activityRows = this.getActivityRows();

        return (
            <div style={{ margin: '20px' }}>
                <Typography variant="h5">Activities</Typography>
                <Box m={2}>
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="Activities">
                            <TableHead>
                                <TableRow>
                                    <HeaderTableCell />
                                    <HeaderTableCell>{t('ehr', 'Distance')}</HeaderTableCell>
                                    <HeaderTableCell>{t('ehr', 'Calories')}</HeaderTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>{loading ? <Loader /> : activityRows}</TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </div>
        );
    }
}
