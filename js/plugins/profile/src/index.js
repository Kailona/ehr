import initialize from './initialize';
import ProfileWidget from './ProfileWidget';

export default {
    id: 'plugin-profile',
    onPreRegisteration: initialize,
    WidgetModule: ProfileWidget,
};
