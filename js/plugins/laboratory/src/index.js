import LabsDataModule from './components/LabsDataModule';
import getTimelineLeukocytes from './timelineData/getTimelineLeukocytes';
import getTimelineHemoglobin from './timelineData/getTimelineHemoglobin';
import getTimelinePlatelets from './timelineData/getTimelinePlatelets';
import getTimelineLymphocytes from './timelineData/getTimelineLymphocytes';
import getTimelineNeutrophils from './timelineData/getTimelineNeutrophils';
import getTimelineEosinophils from './timelineData/getTimelineEosinophils';
import getTimelineBasophils from './timelineData/getTimelineBasophils';
import getTimelineMonocytes from './timelineData/getTimelineMonocytes';

export default {
    id: 'plugin-labs',
    path: '/labs',
    name: t('ehr', 'Labs'),
    MenuModule: {
        name: t('ehr', 'Labs'),
        icon: 'Opacity',
        priority: 70,
    },
    WidgetModule: {
        name: t('ehr', 'Labs'),
        icon: 'Opacity',
        priority: 70,
    },
    DataModule: {
        Component: LabsDataModule,
    },
    TimelineModule: [
        {
            name: t('ehr', 'Blood Test'),
            color: '#ff9063',
            icon: 'Opacity',
            children: [
                {
                    name: t('ehr', 'Leukocytes'),
                    getData: getTimelineLeukocytes,
                },

                {
                    name: t('ehr', 'Hemoglobin'),
                    getData: getTimelineHemoglobin,
                },

                {
                    name: t('ehr', 'Platelets'),
                    getData: getTimelinePlatelets,
                },
                {
                    name: t('ehr', 'Lymphocytes'),
                    getData: getTimelineLymphocytes,
                },

                {
                    name: t('ehr', 'Neutrophils'),
                    getData: getTimelineNeutrophils,
                },
                {
                    name: t('ehr', 'Eosinophils'),
                    getData: getTimelineEosinophils,
                },

                {
                    name: t('ehr', 'Basophils'),
                    getData: getTimelineBasophils,
                },

                {
                    name: t('ehr', 'Monocytes'),
                    getData: getTimelineMonocytes,
                },
            ],
        },
    ],
};
