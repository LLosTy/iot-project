import {LineChart} from "@mui/x-charts/LineChart";


function selectMaxSampleTemps(temperatures) {
    const maxSamples = 25;
    const sampleSize = Math.min(temperatures.length, maxSamples);
    const interval = temperatures.length / sampleSize;

    const sampledTemperatures = [];

    for (let i = 0; i < sampleSize; i++) {
        const index = Math.floor(i * interval);
        sampledTemperatures.push(temperatures[index]);
    }

    return sampledTemperatures.map(i => i.payload.temp);
}

const getIndex = (temperatures) => {
    let indexes = Array.from(Array(temperatures.length).keys())
    for(let index in indexes){
        indexes[index]++
    }
    return indexes
}


const TempLineChart = ({
    rawTemperatures
}) => {
    const temperatures = selectMaxSampleTemps(rawTemperatures)
    const maxTemp = Math.max(temperatures)
    const temperaturesIndex = getIndex(temperatures)

    return(
        <LineChart
            xAxis={[{ scaleType: 'point', data: temperaturesIndex}]}
            series={[{data: temperatures}]}
            height={400}

        />
    )
}
export default TempLineChart;

