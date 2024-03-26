// pages/temps.js
// app/temps/page.js
// 'use client'
import Temperature from '/models/temperature'
// import {useState} from "react";


const GetTemps = async () => {
    try{
        const res = await fetch("http://localhost:3000/api/temps", {
            cache: "no-store",
        })
        // console.log(res)
        return res.json();
    }catch (err){
        console.log(err)
    }
}
export default async function TempsPage(){
    // const [temps, setTemps] = useState([])
    const {temps} = await GetTemps()
    // setTemps(await GetTemps())
    // let temps = []
    // temps = await GetTemps();
// const data = await Temps.find().limit(20)
//     const temps = await GetTemps();
    return (
        <div>
            <h1>Latest Temperatures</h1>
            {/*{temps}*/}
                {temps.map((temp) => (
                    // eslint-disable-next-line react/jsx-key
                    <div>{temp.payload}</div>
                    ))}
        </div>
    );
};

// export default TempsPage;
