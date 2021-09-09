import DataServiceManager from './managers/DataServiceManager';

export default {
    id: 'provider-google-fit',
    name: 'Google Fit',
    icon: GoogleFitIconComponent,
    initialize: DataServiceManager.initialize,
    storeAccessToken: DataServiceManager.storeAccessToken,
    retrieveData: DataServiceManager.retrieveData,
};
