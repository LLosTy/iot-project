
// app/temps/page.js
'use client'
// import Temperature from '/models/temperature'
import { useState, useEffect } from "react";
import { LineChart } from '@mui/x-charts/LineChart';
import { GetTemps, GetTempsByDate } from '../lib/actions'
import TempLineChart from '../../components/TempLineChart'


// const test = (x) =>{
//     let array = []
//     x.forEach((i) => array.push(i.payload))
//     console.log(array)
//     return array
//     // console.log("Test: ",x[0])
// }

export default function TempsPage(){
    const [temps, setTemps] = useState([])
    const [temps2, setTemps2] = useState([])
    let testArr = []
    let temps2Array = []

    
    if (temps !== undefined){
        testArr = temps.map(i => i.payload);
    }

    if (temps2 !== undefined) {
        temps2Array = temps2.map(i => i.payload);
    }

    // const {temps} = GetTemps()
    // const testArr = temps.forEach((i) => testArr.push(i.payload))
    
    // const [ arraytemps ] = toArray(temps)
    // let tempsArr = []
    // tempsArr = toArray(temps)
    // setTemps(await GetTemps())
    // let temps = []
    // temps = await GetTemps();
// const data = await Temps.find().limit(20)
//     const temps = await GetTemps();

    useEffect(() => {
        const dateRange = "2024-02-20_to_2024-03-15"
        const dateFrom = "2024-02-20"
        const dateTo = "2024-03-15"
        /*
        (async () => {
            const fetchedTemps = await GetTemps();
            setTemps(fetchedTemps);
        })();
        */
        const fetchTemps = async () => {
            const fetchedTemps = await GetTemps();
            setTemps(fetchedTemps);
            
            const fetchedTemps2 = await GetTempsByDate(dateFrom, dateTo);
            console.log(fetchedTemps2)
            setTemps2(fetchedTemps2);
        }

        fetchTemps();
    }, [])

    
    return (
        <div>
            <h1>Latest Temperatures</h1>
            {/*{temps}*/}
            {/*    {temps.map((temp) => (*/}
            {/*        // eslint-disable-next-line react/jsx-key*/}
            {/*        <div>{temp.payload}</div>*/}
            {/*        ))}*/}

            {/*{testArr}*/}
            {/*{console.log(testArr)}*/}
            {/*{tempsArr}*/}
            {/*{testArr}*/}
            {/*<LineChart*/}
            {/*    xAxis={[{ scaleType: 'point', data: Array.from(Array(testArr.length).keys())}]}*/}
            {/*    // series={[{data}]}*/}
            {/* series={[{data: testArr}]}*/}
            {/*    height={400}*/}
            {/*/>*/}

            <TempLineChart rawTemperatures={temps}/>

            

        </div>

    );
};