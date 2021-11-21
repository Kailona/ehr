import moment from 'moment';
import DiabetesDataService from '../services/DiabetesDataService';

export default async function getTimelineGlucose(startDate, endDate) {
    const diabetesDataService = new DiabetesDataService();

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
            _elements: 'effectiveDateTime,valueQuantity',
        },
    ];

    const diabetes = await diabetesDataService.fetchData(params);

    const timelineData = [];

    diabetes.forEach(diabetesItem => {
        if (!diabetesItem.date || !diabetesItem.glucoseValue) {
            return;
        }

        timelineData.push({
            date: diabetesItem.date,
            value: diabetesItem.glucoseValue,
        });
    });

    return timelineData.map(data => {
        if (data.value.split) {
            data.value = Number(data.value.split(' ')[0]);
        }

        return data;
    });
}
