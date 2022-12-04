import PhysicalDataService from '../services/PhysicalDataService';

export default async function getTimelineBodyHeight(startDate, endDate) {
    const physicalDataService = new PhysicalDataService();

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
            code: 'http://loinc.org|34565-2',
            _include: 'Observation:has-member',
        },
        {
            _count: 10000,
        },
    ];

    const physicalDataItems = await physicalDataService.fetchData(params);

    const timelineData = [];

    physicalDataItems.forEach(physicalData => {
        if (!physicalData.date || !physicalData.bodyHeight) {
            return;
        }

        timelineData.push({
            date: physicalData.date,
            value: physicalData.bodyHeight,
        });

        return timelineData.map(data => {
            if (data.value.split) {
                data.value = parseInt(data.value.split(' ')[0], 10);
            }

            return data;
        });
    });

    return timelineData;
}
