import DiabetesDataModule from './components/DiabetesDataModule';
import getTimelineGlucose from './timelineData/getTimelineGlucose';
import DiabetesIcon from '../../../platform/ui/src/utils/DiabetesIcon';

export default {
    id: 'plugin-diabetes',
    path: '/diabetes',
    name: t('ehr', 'Diabetes'),
    MenuModule: {
        name: t('ehr', 'Diabetes'),
        icon: {
            component: DiabetesIcon,
            props: {
                fill: 'currentColor',
                stroke: 'currentColor',
            },
        },
        priority: 60,
    },
    WidgetModule: {
        name: t('ehr', 'Diabetes'),
        icon: {
            component: DiabetesIcon,
            props: {
                fill: 'currentColor',
                stroke: 'currentColor',
            },
        },
        priority: 60,
    },
    DataModule: {
        Component: DiabetesDataModule,
    },
    TimelineModule: [
        {
            name: t('ehr', 'Glucose'),
            color: '#7d3c98',
            icon: {
                component: DiabetesIcon,
                props: {
                    fill: 'currentColor',
                    stroke: 'currentColor',
                },
            },
            getData: getTimelineGlucose,
        },
    ],
};
