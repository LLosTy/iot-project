"use client" // app/area/[id]/page.js

import { useParams } from 'next/navigation'
import { useEffect, useState } from "react"
import axios from "axios"
import Viewers from "/_components/Viewers"
import { GetTempsByDevice } from "/_lib/actions/temps"
import TempLineChart from '/_components/TempLineChart'
import axiosInstance from "/axiosInstance";

const AreaPage = () => {
    const [area, setArea] = useState([])
    const [temps, setTemps] = useState([])
    const params = useParams()
    const { id } = params

    useEffect(() => {
        if (id && area.length === 0) {
            console.log(id)
            axiosInstance.get('/area/getArea', {
                params: {
                    areaId: id,
                },
            })
                .then(response => {
                    // Handle success
                    console.log(response.data);
                    setArea(response.data);
                })
                .catch(error => {
                    // Handle error
                    console.error('Caught Error', error);
                });
        }
        if (area.hardwareId) {
            // GetTempsByDevice(area.hardwareId).then((temps) => {setTemps(temps)})
            console.log("Setting temps")
            axiosInstance.get(`/temps?device=${area.hardwareId}`).then(
                response => {setTemps(response.data.temps)}
            )
            // setTemps(rawTemps)
        }
    }, [id, area])

    if (area.length === 0 || !id) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h1>{area.areaName}</h1>
            {temps.length !== 0 ? <TempLineChart rawTemperatures={temps} deviceId={area.hardwareId} /> : <div>No temps</div>}
            <Viewers viewers={area.viewers} areaId={id} />
        </div>
    )
}

export default AreaPage