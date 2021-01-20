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

export default {
    formatPatientName,
    formatCoding,
    formatCodeableConcept,
};
