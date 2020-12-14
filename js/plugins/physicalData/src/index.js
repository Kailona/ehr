import PhysicalDataModule from './components/PhysicalDataModule';

export default {
    id: 'plugin-physical-data',
    path: '/physical-data',
    MenuModule: {
        name: 'Physical Data',
        icon: 'FolderSharedOutlined',
        priority: 100,
    },
    WidgetModule: {
        name: 'Physical Data',
        icon: 'FolderSharedOutlined',
        priority: 100,
    },
    DataModule: {
        Component: PhysicalDataModule,
    },
};
