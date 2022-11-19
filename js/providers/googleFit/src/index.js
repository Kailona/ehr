import DataServiceManager from './managers/DataServiceManager';
import GoogleFitIcon from '../src/icons/google-fit.svg';

export default {
    id: 'provider-google-fit',
    name: 'Google Fit',
    icon: GoogleFitIcon,
    initialize: DataServiceManager.initialize,
    storeAccessToken: DataServiceManager.storeAccessToken,
    retrieveData: DataServiceManager.retrieveData,
};
