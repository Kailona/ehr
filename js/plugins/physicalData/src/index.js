import PhysicalDataModule from './components/PhysicalDataModule';
import getTimelineBmi from './timelineData/getTimelineBmi';
import getTimelineBodyHeight from './timelineData/getTimelineBodyHeight';
import getTimelineBodyWeight from './timelineData/getTimelineBodyWeight';

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
    TimelineModule: [
        {
            name: t('ehr', 'Physical Data'),
            color: '#95631D',
            icon: 'FolderSharedOutlined',
            children: [
                {
                    name: t('ehr', 'BodyWeight'),
                    getData: getTimelineBodyWeight,
                },
                {
                    name: t('ehr', 'BodyHeight'),
                    getData: getTimelineBodyHeight,
                },
                {
                    name: t('ehr', 'BMI'),
                    getData: getTimelineBmi,
                },
            ],
        },
    ],
};
