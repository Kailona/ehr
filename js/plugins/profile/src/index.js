import initialize from './initialize';
import ProfileData from './components/ProfileData';
import ProfileWidget from './components/ProfileWidget';

export default {
    id: 'plugin-profile',
    onPreRegisteration: initialize,
    MenuModule: {
        name: 'Profile',
        icon: null, // TODO: Add menu icon
        path: '/profile',
    },
    DataModule: ProfileData,
    WidgetModule: ProfileWidget,
};
