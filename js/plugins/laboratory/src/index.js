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
    name: 'Labs',
    MenuModule: {
        name: 'Labs',
        icon: 'Opacity',
        priority: 90,
    },
    WidgetModule: {
        name: 'Labs',
        icon: 'Opacity',
        priority: 90,
    },
    DataModule: {
        Component: LabsDataModule,
    },
    TimelineModule: [
        {
            name: 'Blood Test',
            color: '#ff9063',
            icon: 'Opacity',
            children: [
                {
                    name: 'Leukocytes',
                    getData: getTimelineLeukocytes,
                },

                {
                    name: 'Hemoglobin',
                    getData: getTimelineHemoglobin,
                },

                {
                    name: 'Platelets',
                    getData: getTimelinePlatelets,
                },
                {
                    name: 'Lymphocytes',
                    getData: getTimelineLymphocytes,
                },

                {
                    name: 'Neutrophils',
                    getData: getTimelineNeutrophils,
                },
                {
                    name: 'Eosinophils',
                    getData: getTimelineEosinophils,
                },

                {
                    name: 'Basophils',
                    getData: getTimelineBasophils,
                },

                {
                    name: 'Monocytes',
                    getData: getTimelineMonocytes,
                },
            ],
        },
    ],
};
