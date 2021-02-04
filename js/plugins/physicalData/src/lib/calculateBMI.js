export default function calculateBMI(age, weight, height) {
    if (age < 20 || !weight || !height) {
        return null;
    }

    return parseFloat((weight / (height * height)).toFixed(1));
}
