import { Logger } from '@kailona/core';
import authService from '../services/AuthService';
import ActivityService from '../services/ActivityService';
import UnauthorizedException from '../exceptions/UnauthorizedException';
import { convertToFHIR } from '../lib/convertToFHIR';
import ActivitiesService from '../../../../plugins/activities/src/services/ActivitiesService';

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
            return 1;
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
                    return 1;
                }
            }
        }

        const convertDataToFHIR = convertToFHIR(dataList);

        for (const convertedData of convertDataToFHIR) {
            try {
                const { start, end } = convertedData.datePeriod;
                const params = [
                    {
                        date: `ge${moment(start)
                            .utc()
                            .toISOString()}`,
                    },
                    {
                        date: `le${moment(end)
                            .utc()
                            .toISOString()}`,
                    },
                    {
                        _count: 1,
                    },
                ];
                await new ActivitiesService().upsertDataFromGoogleFit(convertedData, params);
            } catch (error) {
                logger.error(error);
                return false;
            }
        }

        return true;
    }
}

const dataServiceManager = new DataServiceManager();
export default dataServiceManager;
