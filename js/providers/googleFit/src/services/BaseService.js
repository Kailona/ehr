import axios from 'axios';
import authService from './AuthService';
import UnauthorizedException from '../exceptions/UnauthorizedException';

export default class BaseService {
    async _retrieveData(baseUrl, url, queryParameters = {}, headers = {}) {
        // Validate current access token first
        const isAccessTokenValid = await authService.isAccessTokenValid();

        // Invalid access token
        if (!isAccessTokenValid) {
            throw new UnauthorizedException();
        }

        queryParameters['access_token'] = authService.AccessToken;

        const httpConfig = {
            baseURL: baseUrl,
            params: queryParameters,
            headers,
        };

        try {
            const { data } = await axios.get(url, httpConfig);

            if (!data) {
                logger.error(`Data could not be retrieved from ${url}!`);
                return false;
            }

            return data;
        } catch (e) {
            logger.error(`Data could not be retrieved from ${url}!`, e);
        }
    }
}
