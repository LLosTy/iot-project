"use client" // app/area/[id]/page.js

import { useParams } from 'next/navigation'
import { useEffect, useState } from "react"
import axios from "axios"
import Viewers from "/_components/Viewers"
import { GetTempsByDevice } from "/_lib/actions/temps"
import TempLineChart from '/_components/TempLineChart'

const AreaPage = () => {
    const [area, setArea] = useState([])
    const [temps, setTemps] = useState([])
    const params = useParams()
    const { id } = params

    useEffect(() => {
        if (id && area.length === 0) {
            console.log(id)
            axios({
                method: 'get',
                baseURL: process.env.NEXT_PUBLIC_API_URL + process.env.SERVER_PORT + '/area/getArea',
                params: {
                    areaId: id
                },
                responseType: 'json',
            })
                .then(response => {
                    // handle success
                    console.log(response.data)
                    setArea(response.data)
                })
                .catch(error => {
                    // handle error
                    console.error("Caught Error", error)
                })
        }
    }, [id, area])

    const getTemps = async () => {
        if (area.hardwareId) {
            const rawTemps = await GetTempsByDevice(area.hardwareId)
            setTemps(rawTemps)
        }
    }

    if (area.length === 0 || !id) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h1>{area.areaName}</h1>
            {temps.length !== 0 ? <TempLineChart rawTemperatures={temps} /> : <div>No temps</div>}
            <Viewers viewers={area.viewers} areaId={id} />
            <button onClick={getTemps}>Get Temps</button>
        </div>
    )
}

export default AreaPage