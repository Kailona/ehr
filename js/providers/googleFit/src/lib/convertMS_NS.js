const convertMStoNS = ms => {
    return ms * 1000000;
};

const convertNStoMS = ns => {
    return ns / 1000000;
};

export { convertMStoNS, convertNStoMS };
