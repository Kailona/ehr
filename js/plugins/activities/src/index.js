import ActivitiesDataModule from './components/ActivitiesDataModule';
import importData from './importData';
import getTimelineSteps from './timelineData/getTimelineSteps';

export default {
    id: 'plugin-activities',
    path: '/activities',
    name: t('ehr', 'Activities'),
    MenuModule: {
        name: t('ehr', 'Activities'),
        icon: 'DirectionsRun',
        priority: 90,
    },
    WidgetModule: {
        name: t('ehr', 'Activities'),
        icon: 'DirectionsRun',
        priority: 90,
    },
    DataModule: {
        Component: ActivitiesDataModule,
        importData,
    },
    TimelineModule: [
        {
            name: t('ehr', 'Steps'),
            color: '#58d68d',
            icon: 'DirectionsRun',
            getData: getTimelineSteps,
        },
    ],
};
