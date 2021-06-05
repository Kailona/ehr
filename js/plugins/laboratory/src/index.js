import LabsDataModule from './components/LabsDataModule';
import getTimelineLeukocytes from './timelineData/getTimelineLeukocytes';
import getTimelineHemoglobin from './timelineData/getTimelineHemoglobin';
import getTimelinePlatelets from './timelineData/getTimelinePlatelets';
//import getTimelineLeucocytes from './timelineData/getTimelineLeucocytes';
//import getTimelineLymphocytes from './timelineData/getTimelineLymphocytes';
// import getTimelineNeutrophil from './timelineData/getTimelineNeutrophil';
// import getTimelineEosinophil from './timelineData/getTimelineEosinophil';
// import getTimelineBasophil from './timelineData/getTimelineBasophil';
// import getTimelineMonocyte from './timelineData/getTimelineMonocyte';

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
        // {
        //     name: 'Leucocytes',
        //     color: '#36a3eb',
        //     icon: 'FavoriteBorder',
        //     getData: getTimelineLeucocytes,
        //     children: [
        //         {
        //             name: 'Lymphocytes',
        //             getData: getTimelineLymphocytes,
        //         },

        //         {
        //             name: 'Neutrophil',
        //             getData: getTimelineNeutrophil,
        //         },
        //         {
        //             name: 'Eosinophil',
        //             getData: getTimelineEosinophil,
        //         },

        //         {
        //             name: 'Basophil',
        //             getData: getTimelineBasophil,
        //         },

        //         {
        //             name: 'Monocyte',
        //             getData: getTimelineMonocyte,
        //         },
        //     ],
        // },
        {
            name: 'Leukocytes',
            color: '#ff6384',
            icon: 'Opacity',
            getData: getTimelineLeukocytes,
        },
        {
            name: 'Hemoglobin',
            color: '#ff6374',
            icon: 'Opacity',
            getData: getTimelineHemoglobin,
        },
        {
            name: 'Platelets',
            color: '#ff6364',
            icon: 'Opacity',
            getData: getTimelinePlatelets,
        },
    ],
};
