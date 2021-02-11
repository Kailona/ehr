import moment from 'moment';
import VitalsService from '../services/VitalsService';

export default async function getTimelineBloodPressureDiastolic(startDate, endDate) {
    const vitalsService = new VitalsService();

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
            code: 'http://loinc.org|85354-9',
        },
        {
            _sort: '-date',
            _count: 100000, // TODO: any way to unlimit in fhir?
            _elements: 'effectiveDateTime,component',
        },
    ];

    const vitals = await vitalsService.fetchData(params);

    const timelineData = [];

    vitals.forEach(vitalsItem => {
        if (!vitalsItem.date || !vitalsItem.diastolicBloodPressure) {
            return;
        }

        timelineData.push({
            date: vitalsItem.date,
            value: vitalsItem.diastolicBloodPressure,
        });
    });

    return timelineData.map(data => {
        if (data.value.split) {
            data.value = parseInt(data.value.split(' ')[0], 10);
        }

        return data;
    });
}
