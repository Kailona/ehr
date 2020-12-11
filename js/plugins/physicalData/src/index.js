import PhysicalDataModule from './components/PhysicalDataModule';
import PhysicalDataWidget from './components/PhysicalDataWidget';

export default {
    id: 'plugin-physical-data',
    MenuModule: {
        name: 'Physical Data',
        icon: null, // TODO: Add menu icon
        path: '/physical-data',
        priority: 100,
    },
    DataModule: PhysicalDataModule,
    WidgetModule: PhysicalDataWidget,
};
