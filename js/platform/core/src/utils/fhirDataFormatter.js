import moment from 'moment';

const DATE_FORMAT = 'ddd, MMM D, YYYY';
const TIME_FORMAT = 'HH:mm';

const formatPatientName = name => {
    if (!name || !name.length) {
        return '';
    }

    const usualName = name.find(n => n.use === 'usual') || name[0];
    const { text, given, family, prefix, suffix } = usualName;

    if (text) {
        return text;
    }

    const familyGiven = [];
    if (family) {
        familyGiven.push(family);
    }
    if (given && given.length) {
        familyGiven.push(given.join(' '));
    }

    const fullName = [];
    if (prefix && prefix.length) {
        fullName.push(prefix.join(', '));
    }
    if (familyGiven && familyGiven.length) {
        fullName.push(familyGiven.join(', '));
    }
    if (suffix && suffix.length) {
        fullName.push(suffix.join(', '));
    }

    if (!fullName || !fullName.length) {
        return '';
    }

    return fullName.join(', ');
};

const formatCoding = coding => {
    if (!coding || !coding.length) {
        return '';
    }

    return t('ehr', coding.display);
};

const formatCodeableConcept = codeableConcept => {
    if (!codeableConcept || !codeableConcept.length) {
        return '';
    }

    const { coding } = codeableConcept[0];
    return formatCoding(coding);
};

const formatDatePeriod = datePeriod => {
    const { start, end } = datePeriod || {};
    if (!start || !end) {
        return '';
    }

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
};

export default {
    formatPatientName,
    formatCoding,
    formatCodeableConcept,
    formatDatePeriod,
};
