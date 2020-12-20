import ActivitiesDataModule from './components/ActivitiesDataModule';

export default {
    id: 'plugin-activities',
    path: '/activities',
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
    },
};
