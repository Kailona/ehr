import moment from 'moment';

export default function calculateAge(birthDate, whenDate) {
    return Math.ceil(moment(whenDate).diff(moment(birthDate), 'years'));
}
