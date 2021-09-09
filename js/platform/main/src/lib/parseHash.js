export default function parseHash(hash) {
    if (!hash) {
        return null;
    }

    try {
        // If any '#' character in hash string, remove it
        const parameters = hash.startsWith('#') ? hash.substring(1).split('&') : hash.split('&');

        const queryParameters = {};
        parameters.forEach(parameter => {
            const [key, value] = parameter.split('=');

            queryParameters[key] = value;
        });

        return queryParameters;
    } catch (e) {
        // Do not block process for incompatible hash values
    }

    return null;
}
