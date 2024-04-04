import {LineChart} from "@mui/x-charts/LineChart";

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
    const temperatures = rawTemperatures.map(i => i.payload);
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

