import DiabetesDataModule from './components/DiabetesDataModule';
import getTimelineGlucose from './timelineData/getTimelineGlucose';

export default {
    id: 'plugin-diabetes',
    path: '/diabetes',
    name: t('ehr', 'Diabetes'),
    MenuModule: {
        name: t('ehr', 'Diabetes'),
        icon: 'Opacity',
        priority: 60,
    },
    WidgetModule: {
        name: t('ehr', 'Diabetes'),
        icon: 'Opacity',
        priority: 60,
    },
    DataModule: {
        Component: DiabetesDataModule,
    },
    TimelineModule: [
        {
            name: t('ehr', 'Glucose'),
            color: '#7d3c98',
            icon: 'Opacity',
            getData: getTimelineGlucose,
        },
    ],
};
