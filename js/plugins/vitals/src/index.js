import VitalsDataModule from './components/VitalsDataModule';
import getTimelineBloodPressureSystolic from './timelineData/getTimelineBloodPressureSystolic';
import getTimelineBloodPressureDiastolic from './timelineData/getTimelineBloodPressureDiastolic';

export default {
    id: 'plugin-vitals',
    path: '/vitals',
    name: 'Vitals',
    MenuModule: {
        name: 'Vitals',
        icon: 'FavoriteBorder',
        priority: 90,
    },
    WidgetModule: {
        name: 'Vitals',
        icon: 'FavoriteBorder',
        priority: 90,
    },
    DataModule: {
        Component: VitalsDataModule,
    },
    TimelineModule: [
        {
            name: 'Systolic Blood Pressure',
            color: '#36a3eb',
            icon: 'FavoriteBorder',
            getData: getTimelineBloodPressureSystolic,
        },
        {
            name: 'Diastolic Blood Pressure',
            color: '#41b3a3',
            icon: 'FavoriteBorder',
            getData: getTimelineBloodPressureDiastolic,
        },
    ],
};
