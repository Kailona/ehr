import DiabetesDataModule from './components/DiabetesDataModule';
import getTimelineGlucose from './timelineData/getTimelineGlucose';
import { Icons } from '@kailona/ui';

export default {
    id: 'plugin-diabetes',
    path: '/diabetes',
    name: t('ehr', 'Diabetes'),
    MenuModule: {
        name: t('ehr', 'Diabetes'),
        icon: {
            component: Icons.DiabetesIcon,
        },
        priority: 60,
    },
    WidgetModule: {
        name: t('ehr', 'Diabetes'),
        icon: {
            component: Icons.DiabetesIcon,
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
                component: Icons.DiabetesIcon,
                color: '#7d3c98',
            },
            getData: getTimelineGlucose,
        },
    ],
};
