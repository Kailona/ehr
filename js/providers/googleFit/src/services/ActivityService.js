import { Logger } from '@kailona/core';
import moment from 'moment-timezone';
import BaseService from './BaseService';
import { api } from '../lib/constants';
import convertMStoNS from '../lib/convertMStoNS';

const logger = new Logger('GoogleFitProvider.ActivityService');

class ActivityService extends BaseService {
    /***
     * This function is used to retrieve user session list
     *
     * @param {Array} sessionList
     * @param {string || null} pageToken
     * @private
     */
    async _retrieveSessions(sessionList, pageToken = null) {
        const { baseUrl, session } = api;
        const { list: listSessionUrl } = session.url;

        const queryParameters = {};
        if (pageToken) {
            queryParameters.pageToken = pageToken;
        }

        const sessionResponseData = await this._retrieveData(baseUrl, listSessionUrl, queryParameters);
        const { nextPageToken, session: userSessionList } = sessionResponseData;
        if (!userSessionList.length) {
            // No user session data anymore
            return sessionList;
        }

        sessionList.push(...userSessionList);

        if (nextPageToken) {
            return await this._retrieveSessions(sessionList, nextPageToken);
        }

        return sessionList;
    }

    /***
     * This function is used to retrieve user dataSources
     * @private
     */
    async _retrieveDataSources() {
        const { baseUrl, dataSource } = api;
        const { list: listDataSourceUrl } = dataSource.url;

        const data = (await this._retrieveData(baseUrl, listDataSourceUrl)) || {};

        return data.dataSource || [];
    }

    /***
     * This function is used to retrieve user dataSources.datasets
     *
     * @param {Array} dataStreamIds
     * @private
     */
    async _retrieveDatasets(dataStreamIds) {
        const { dataset } = api;
        const { url: datasetUrl, filter } = dataset;
        const { get: getDatasetUrl } = datasetUrl;
        const { timezone, interval } = filter;
        const { value, unit } = interval;

        const endDateTime = moment.tz(new Date(), timezone);
        const startDateTime = moment().subtract(value, unit);

        const endDateTimeInNS = convertMStoNS(endDateTime.valueOf());
        const startDateTimeInNS = convertMStoNS(startDateTime.valueOf());

        const url = getDatasetUrl.replace('{datasetId}', `${startDateTimeInNS}-${endDateTimeInNS}`);

        const datasetList = [];
        for (const dataStreamId of dataStreamIds) {
            const copiedDatasetUrl = `${url}`.replace('{dataSourceId}', dataStreamId);

            await this._retrieveDatasetByPaging(copiedDatasetUrl, dataStreamId, datasetList);
        }

        return datasetList;
    }

    async _retrieveDatasetByPaging(url, dataStreamId, datasetList, pageToken = null) {
        const { baseUrl, dataset } = api;
        const { limit } = dataset;

        const queryParameters = {
            limit,
        };

        if (pageToken) {
            queryParameters.pageToken = pageToken;
        }

        const data = await this._retrieveData(baseUrl, url, queryParameters);
        if (!data) {
            return;
        }

        datasetList.push(data);

        const { nextPageToken } = data;
        if (!nextPageToken) {
            return;
        }

        await this._retrieveDatasetByPaging(url, dataStreamId, datasetList, nextPageToken);
    }

    _parseApplicationPackagesFromSessions(sessionList) {
        const applicationPackages = [];

        sessionList.forEach(session => {
            const { application } = session;
            const { name, packageName } = application;

            let key,
                value = '';

            if (name) {
                key = 'name';
                value = name;
            } else {
                key = 'packageName';
                value = packageName;
            }

            if (applicationPackages.some(applicationPackage => applicationPackage[key] === value)) {
                return;
            }

            applicationPackages.push({
                key,
                value,
            });
        });

        return applicationPackages;
    }

    _parseDataStreamIds(applicationPackages, dataSourceList) {
        const dataStreamIdListToRead = [];
        applicationPackages.forEach(applicationPackage => {
            const { key, value } = applicationPackage;

            const dataStreamIdList = dataSourceList
                .filter(
                    dataSource =>
                        dataSource.application && dataSource.application[key] === value && dataSource.dataStreamId
                )
                .map(dataSource => dataSource.dataStreamId);

            dataStreamIdListToRead.push(...dataStreamIdList);
        });

        return dataStreamIdListToRead;
    }

    /***
     * This function is used to retrieve user activities data from Google Fit
     */
    async retrieveData() {
        // Retrieve user session list
        const sessionList = [];
        await this._retrieveSessions(sessionList);
        if (!sessionList.length) {
            // No user session data
            return;
        }

        // Parse application packages by session.application.name or session.application.packageName values
        const applicationPackagesToRead = this._parseApplicationPackagesFromSessions(sessionList);

        // Retrieve dataSources
        const dataSourceList = await this._retrieveDataSources();
        if (!dataSourceList || !dataSourceList.length) {
            // No user dataSource data
            return;
        }

        // Parse dataStreamIds by session.application.name or session.application.packageName values
        const dataStreamIdListToRead = this._parseDataStreamIds(applicationPackagesToRead, dataSourceList);
        if (!dataStreamIdListToRead.length) {
            // No data to read
            return;
        }

        // Retrieve dataset by the dataStreamIdList and default date interval in nanoseconds
        const datasets = await this._retrieveDatasets(dataStreamIdListToRead);
    }
}

const activityService = new ActivityService();
export default activityService;
