export default function convertToFloatWith2Digit(number) {
    if (!number) {
        return 0;
    }

    const value = number.toString();

    if (value.split('.')[1] && value.split('.')[1].length > 1) {
        return parseFloat((+value).toFixed(2));
    }

    return parseFloat(value);
}
