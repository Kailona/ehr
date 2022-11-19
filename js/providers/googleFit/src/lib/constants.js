const auth = {
    signIn: {
        url: 'https://accounts.google.com/o/oauth2/v2/auth',
        queryParameters: {
            redirect_uri: 'http://localhost:3001/apps/ehr',
            response_type: 'token',
            scope: 'https://www.googleapis.com/auth/fitness.activity.read',
            include_granted_scopes: true,
            client_id: '614617486987-qv917ol911j5cq8ghpldhaj5aoqqhtm4.apps.googleusercontent.com',
            state: 'provider-google-fit',
        },
    },
    validation: {
        baseUrl: 'https://oauth2.googleapis.com/',
        url: 'tokeninfo',
    },
};

const api = {
    baseUrl: 'https://www.googleapis.com/fitness/v1/users/me',
    aggregate: {
        url: {
            aggregate: '/dataset:aggregate',
        },
    },
    session: {
        url: {
            list: '/sessions',
        },
    },
    dataSource: {
        url: {
            list: '/dataSources',
        },
    },
    dataset: {
        url: {
            get: '/dataSources/{dataSourceId}/datasets/{datasetId}',
        },
        filter: {
            timezone: 'UTC',
            interval: {
                value: 30,
                unit: 'days', // Use 'unit' values which are defined in 'moment-timezone' library
            },
        },
        limit: 1000,
    },
};

const dataSourceId = {
    // TODO: gonna make for sessionData also.
    baseSessionDataSourceId:
        'derived:com.google.activity.segment:com.google.android.apps.fitness:session_activity_segment',
    baseUserInputDataSourceId: 'raw:{dataTypeName}:com.google.android.apps.fitness:user_input',
    userInputDataTypeName: {
        steps: 'com.google.step_count.delta',
        calories: 'com.google.calories.expended',
    },
};

export { api, auth, dataSourceId };
