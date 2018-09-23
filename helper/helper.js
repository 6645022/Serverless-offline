const helpers = {
    calculateAgeAverage(ages){
        const ageCount = ages.length;
        const sum = ages.reduce((a, b) => a + b, 0);
        return sum / ageCount
    }
}
module.exports = helpers