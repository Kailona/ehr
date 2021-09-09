import { Logger } from '@kailona/core';
import authService from '../services/AuthService';
import ActivityService from '../services/ActivityService';
import UnauthorizedException from '../exceptions/UnauthorizedException';

const logger = new Logger('GoogleFitProvider.DataServiceManager');

const dataServices = [];

class DataServiceManager {
    initialize() {
        dataServices.push(ActivityService);
    }

    storeAccessToken(token) {
        authService.AccessToken = token;
    }

    async retrieveData() {
        // Validate current access token first
        const isAccessTokenValid = await authService.isAccessTokenValid();

        // Redirect user to google sign-in page
        if (!isAccessTokenValid) {
            authService.signIn();
            return;
        }

        // Retrieve Google Fit data for each registered data type
        const dataList = [];
        for (const dataService of dataServices) {
            try {
                const data = await dataService.retrieveData();
                dataList.push(data);
            } catch (error) {
                logger.error(error);

                if (error instanceof UnauthorizedException) {
                    // Redirect user to google sign-in page
                    authService.signIn();
                    return;
                }
            }
        }

        return dataList;
    }
}

const dataServiceManager = new DataServiceManager();
export default dataServiceManager;
