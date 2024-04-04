'use client'
import TempLineChart from '/components/TempLineChart'
import GetTemps from '/libs/GetTemps'
export default async function TempsPage(){
    const {temps} = await GetTemps()
    return (
        <div>
            <h1>Latest Temperatures</h1>
            <TempLineChart rawTemperatures={temps}/>
        </div>

    );
};