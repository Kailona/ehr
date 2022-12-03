import moment from 'moment';
import ActivitiesService from '../services/ActivitiesService';

function mapTimelineSteps(data, isDaily) {
    // Group by date: Sum the entries at the same date range interval
    const dataByDate = data.reduce((acc, item) => {
        const { date: actualDate, value } = item;

        let date = moment(actualDate);

        if (!isDaily) {
            const dateRangeItemFormat = 'YYYY-MM-DD'; // group day by day
            date = moment(actualDate).format(dateRangeItemFormat);
        }

        acc[date] = (acc[date] || 0) + value;
        return acc;
    }, {});

    return Object.keys(dataByDate).map(date => ({
        date,
        value: dataByDate[date],
    }));
}

export default async function getTimelineSteps(startDate, endDate, isDaily) {
    const activitiesService = new ActivitiesService();

    const params = [
        {
            date: `ge${moment(startDate)
                .hour(0)
                .minute(0)
                .second(0)
                .utc()
                .toISOString()}`,
        },
        {
            date: `le${moment(endDate)
                .hour(23)
                .minute(59)
                .second(59)
                .utc()
                .toISOString()}`,
        },
        {
            _sort: '-date',
            _count: 100000, // TODO: any way to unlimit in fhir?
            _elements: 'effectivePeriod,component',
        },
    ];

    const activities = await activitiesService.fetchData(params);

    const timelineData = [];

    activities.forEach(activity => {
        if (!activity.datePeriod || !activity.datePeriod.start || !activity.steps) {
            return;
        }

        timelineData.push({
            date: activity.datePeriod.start,
            value: activity.steps,
        });
    });

    return mapTimelineSteps(timelineData, isDaily);
}
