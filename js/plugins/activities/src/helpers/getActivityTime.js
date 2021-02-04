import moment from 'moment';

const DATE_FORMAT = 'ddd, MMM D, YYYY';
const TIME_FORMAT = 'HH:mm';

export default function getActivityTime(activity) {
    const { effectiveDateTime, effectivePeriod } = activity;

    // Single Date/Time
    if (effectiveDateTime) {
        return moment(effectiveDateTime)
            .local()
            .format(`${DATE_FORMAT}, ${TIME_FORMAT}`);
    }

    // Date/Time Range
    const { start, end } = effectivePeriod || {};
    if (start && end) {
        const startMoment = moment(start).local();
        const endMoment = moment(end).local();

        if (startMoment.isSame(endMoment, 'day')) {
            const day = startMoment.format(DATE_FORMAT);
            const startTime = startMoment.format(TIME_FORMAT);
            const endTime = endMoment.format(TIME_FORMAT);
            return `${day}, ${startTime} - ${endTime}`;
        } else {
            const startDay = startMoment.format(DATE_FORMAT);
            const endDay = endMoment.format(DATE_FORMAT);
            const startTime = startMoment.format(TIME_FORMAT);
            const endTime = endMoment.format(TIME_FORMAT);
            return `${startDay}, ${startTime} - ${endDay}, ${endTime}`;
        }
    }

    return '';
}
