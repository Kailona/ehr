import moment from 'moment';
import { dataSourceId } from './constants';
import { convertNStoMS } from './convertMS_NS';

export function convertToFHIR(dataList) {
    /* Activity Data, get step and calories data and convert to FHIR
     * TODO: Check health data of google apis. In future, if fetch data from there, convert data here.
     * Seperate data models as functions. For this, get one more parameter as data model indicator.
     */
    const { baseUserInputDataSourceId, userInputDataTypeName } = dataSourceId;
    const { steps, calories } = userInputDataTypeName;
    const baseDataSourceIds = [
        baseUserInputDataSourceId.replace('{dataTypeName}', steps),
        baseUserInputDataSourceId.replace('{dataTypeName}', calories),
    ];
    const activityDatas = {
        steps: [],
        calories: [],
    };
    const returnData = [];

    dataList.flat().map(data => {
        if (data.dataSourceId === baseDataSourceIds[0]) {
            activityDatas.steps.push(data.point);
        } else if (data.dataSourceId === baseDataSourceIds[1]) {
            activityDatas.calories.push(data.point);
        }
    });

    activityDatas.steps.flat().map(data => {
        const datePeriod = convertDatesAsModel(data.startTimeNanos, data.endTimeNanos);
        /*
         * check if the returnData has same date as data so, don't push it. ,
         * TODO: check it also when fetching data from Google API
         */
        const checkData = returnData.find(e => moment(e.datePeriod.start).isSame(datePeriod.start));
        if (!!checkData) {
            return;
        }

        const step = getStepValue(data);

        const calorieData = activityDatas.calories
            .flat()
            .find(
                calorie => calorie.startTimeNanos === data.startTimeNanos && calorie.endTimeNanos === data.endTimeNanos
            );
        const calorie = getCalorieValue(calorieData);

        const activityModel = {
            datePeriod: datePeriod,
            steps: step,
            calories: calorie,
        };
        returnData.push(activityModel);
    });

    return returnData;
}

function getStepValue(data) {
    return data.value.reduce((total, value) => {
        return total + value.intVal;
    }, 0);
}

function getCalorieValue(data) {
    return data.value.reduce((total, value) => {
        return total + value.fpVal;
    }, 0);
}

function convertDatesAsModel(startDate, endDate) {
    return {
        start: new Date(convertNStoMS(startDate)),
        end: new Date(convertNStoMS(endDate)),
    };
}
