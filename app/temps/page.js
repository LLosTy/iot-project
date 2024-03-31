'use client'
import TempLineChart from '/components/TempLineChart'
const GetTemps = async () => {
    try{
        const res = await fetch("http://localhost:3000/api/temps", {
            cache: "no-store",
        })
        return res.json();
    }catch (err){
        console.log(err)
    }
}
export default async function TempsPage(){
    const {temps} = await GetTemps()
    return (
        <div>
            <h1>Latest Temperatures</h1>
            <TempLineChart rawTemperatures={temps}/>
        </div>

    );
};