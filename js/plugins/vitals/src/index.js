import VitalsDataModule from './components/VitalsDataModule';

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
};
