// pages/temps.js
// app/temps/page.js
'use client'
// import Temperature from '/models/temperature'
// import {useState} from "react";
import { LineChart } from '@mui/x-charts/LineChart';



const GetTemps = async () => {
    try{
        const res = await fetch("http://localhost:3000/api/temps", {
            cache: "no-store",
        })
        // const testArr =[]
        // res.forEach((i) => testArr.push(i.payload))
        // return testArr

        // console.log(res)
        return res.json();
    }catch (err){
        console.log(err)
    }
}
// const test = (x) =>{
//     let array = []
//     x.forEach((i) => array.push(i.payload))
//     console.log(array)
//     return array
//     // console.log("Test: ",x[0])
// }
export default async function TempsPage(){
    // const [temps, setTemps] = useState([])
    const {temps} = await GetTemps()
    // const testArr = temps.forEach((i) => testArr.push(i.payload))
    const testArr = temps.map(i => i.payload);
    // const [ arraytemps ] = toArray(temps)
    // let tempsArr = []
    // tempsArr = toArray(temps)
    // setTemps(await GetTemps())
    // let temps = []
    // temps = await GetTemps();
// const data = await Temps.find().limit(20)
//     const temps = await GetTemps();
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
            <LineChart
                xAxis={[{ scaleType: 'point', data: Array.from(Array(testArr.length).keys())}]}
                // series={[{data}]}
             series={[{data: testArr}]}
                height={400}
            />
        </div>

    );
};

// export default TempsPage;
