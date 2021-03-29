import ActivitiesDataModule from './components/ActivitiesDataModule';
import importData from './importData';
import getTimelineSteps from './timelineData/getTimelineSteps';

export default {
    id: 'plugin-activities',
    path: '/activities',
    name: 'Activities',
    MenuModule: {
        name: 'Activities',
        icon: 'DirectionsRun',
        priority: 90,
    },
    WidgetModule: {
        name: 'Activities',
        icon: 'DirectionsRun',
        priority: 90,
    },
    DataModule: {
        Component: ActivitiesDataModule,
        importData,
    },
    TimelineModule: [
        {
            name: 'Steps',
            color: '#58d68d',
            icon: 'DirectionsRun',
            getData: getTimelineSteps,
        },
    ],
};
