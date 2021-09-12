import PhysicalDataModule from './components/PhysicalDataModule';

export default {
    id: 'plugin-physical-data',
    path: '/physical-data',
    name: t('ehr', 'Physical Data'),
    MenuModule: {
        name: t('ehr', 'Physical Data'),
        icon: 'FolderSharedOutlined',
        priority: 100,
    },
    WidgetModule: {
        name: t('ehr', 'Physical Data'),
        icon: 'FolderSharedOutlined',
        priority: 100,
    },
    DataModule: {
        Component: PhysicalDataModule,
    },
};
