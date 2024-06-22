"use client"// app/area/[id]/page.js

import { useParams } from 'next/navigation';
import {useEffect, useState} from "react";
import axios from "axios";
import Viewers from "/_components/Viewers"
import {GetTempsByDevice} from "/_lib/actions/temps";
import TempLineChart from '/_components/TempLineChart'

const AreaPage = () => {
    const [area, setArea] = useState([]);

    useEffect(() => {


        if (id && area.length === 0 ) {
            console.log(area)
            axios({
                method: 'get',
                baseURL: 'http://localhost:8080/area/getArea',
                params: {
                    areaId:id
                },
                responseType: 'json',
            })
                .then(response => {
                    // handle success
                    console.log(response.data);
                    setArea(response.data);
                })
                .catch(error => {
                    // handle error
                    console.error("Caught Error",error);
                });
        }
    });

    const [temps,setTemps] = useState([])

    const getTemps = async ()=> {
        if(area){
            const rawTemps = await GetTempsByDevice(area.hardwareId)
            // console.log(query)
            // const temps = query.map((temp) => temp.payload.temp)
            setTemps(rawTemps)
        }
    }

    const params = useParams();
    const { id } = params;
    console.log("Area ID in page.js:",id)
    if(area.length !== 0 && id){
        return (
            <div>
                <h1>{area.areaName}</h1>
                {(temps.length !== 0) ? <> <TempLineChart rawTemperatures={temps}></TempLineChart> </> : <div>No temps</div>}
                {/*<h2>{area.viewers[0]}</h2>*/}
                {/*<h2>Area info: {area}</h2>*/}
                <Viewers viewers={area.viewers} areaId={id}></Viewers>
                <button onClick={getTemps}>Get Temps</button>

            </div>
        );
    }
};

export default AreaPage;
