import axios from 'axios';
import { Logger, LocalStorageService } from '@kailona/core';
import { auth } from '../lib/constants';

const logger = new Logger('GoogleFitProvider.AuthService');

const accessTokenKey = 'google_fit_access_token';

class AuthService {
    get AccessToken() {
        return LocalStorageService.getItem(accessTokenKey);
    }

    set AccessToken(value) {
        LocalStorageService.upsertItem(accessTokenKey, value);
    }

    async isAccessTokenValid() {
        // No retrieved and stored access token
        if (!this.AccessToken) {
            return false;
        }

        const { validation } = auth;
        const { baseUrl, url } = validation;

        const queryParameters = {
            access_token: this.AccessToken,
        };

        const httpConfig = {
            baseURL: baseUrl,
            params: queryParameters,
            method: 'GET',
        };

        try {
            const { data } = await axios.get(url, httpConfig);

            if (!data) {
                logger.error(`An access token could not be validated!`);
                return false;
            }

            const { error } = data;
            return !error;
        } catch (e) {
            logger.error(`An access token could not be validated!`, e);
        }

        return false;
    }

    signIn() {
        const { signIn } = auth;
        const { url, queryParameters } = signIn;

        const queryParametersInString = Object.keys(queryParameters)
            .map(key => `${key}=${queryParameters[key]}`)
            .join('&');

        const signInUrl = `${url}?${queryParametersInString}`;

        const signInWindow = window.open(signInUrl, queryParameters.state, `width=500,height=650,toolbar=0,menubar=0`);

        signInWindow.focus();
    }
}

const authService = new AuthService();
export default authService;
