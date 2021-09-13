import VitalsDataModule from './components/VitalsDataModule';
import getTimelineBloodPressureSystolic from './timelineData/getTimelineBloodPressureSystolic';
import getTimelineBloodPressureDiastolic from './timelineData/getTimelineBloodPressureDiastolic';
import getTimelineBodyTemperature from './timelineData/getTimelineBodyTemperature';

export default {
    id: 'plugin-vitals',
    path: '/vitals',
    name: t('ehr', 'Vitals'),
    MenuModule: {
        name: t('ehr', 'Vitals'),
        icon: 'FavoriteBorder',
        priority: 80,
    },
    WidgetModule: {
        name: t('ehr', 'Vitals'),
        icon: 'FavoriteBorder',
        priority: 80,
    },
    DataModule: {
        Component: VitalsDataModule,
    },
    TimelineModule: [
        {
            name: t('ehr', 'Blood Pressure'),
            color: '#36a3eb',
            icon: 'FavoriteBorder',
            children: [
                {
                    name: t('ehr', 'Systolic'),
                    getData: getTimelineBloodPressureSystolic,
                },

                {
                    name: t('ehr', 'Diastolic'),
                    getData: getTimelineBloodPressureDiastolic,
                },
            ],
        },
        {
            name: t('ehr', 'Body Temperature'),
            color: '#ff6384',
            icon: 'WhatshotOutlined',
            getData: getTimelineBodyTemperature,
        },
    ],
};
