import BMIWeightStatusEnum from './BMIStatus.enum';

export default function getBMIWeightStatus(bmi) {
    if (!bmi) {
        return BMIWeightStatusEnum.Unknown;
    }

    if (bmi < 18.5) {
        return BMIWeightStatusEnum.Underweight;
    }

    if (bmi < 25) {
        return BMIWeightStatusEnum.Normal;
    }

    if (bmi < 30) {
        return BMIWeightStatusEnum.Overweight;
    }

    return BMIWeightStatusEnum.Obese;
}
