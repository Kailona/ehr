export default function getActivityValue(activity, system, code) {
    const { component } = activity;
    const walkingDistanceComponent = component.find(c =>
        c.code.coding.some(coding => coding.system === system && coding.code === code)
    );

    const { value, unit } = (walkingDistanceComponent && walkingDistanceComponent.valueQuantity) || {};
    return {
        value: value || '',
        unit: unit || '',
    };
}
