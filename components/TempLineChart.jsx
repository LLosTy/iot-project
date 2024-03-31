import {LineChart} from "@mui/x-charts/LineChart";

const TempLineChart = ({
    rawTemperatures
}) => {
    const temperatures = rawTemperatures.map(i => i.payload);
    const temperaturesIndex = Array.from(Array(temperatures.length).keys())
    return(
        <LineChart
            xAxis={[{ scaleType: 'point', data: temperaturesIndex}]}
            series={[{data: temperatures}]}
            height={400}
        />
    )
}
export default TempLineChart;

