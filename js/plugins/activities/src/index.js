import ActivitiesDataModule from './components/ActivitiesDataModule';
import importData from './importData';

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
};
