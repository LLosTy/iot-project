
// app/temps/page.js
'use client'
// import Temperature from '/models/temperature'
import React from "react";
import { useState, useEffect } from "react";
// import { LineChart } from '@mui/x-charts/LineChart';
import { GetTemps, GetTempsByDate } from '../lib/actions'
import TempLineChart from '../../components/TempLineChart'
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


export default function TempsPage(){
    const [temps, setTemps] = useState([])
    const [temps2, setTemps2] = useState([])
    const [dateFrom, setDateFrom] = useState(dayjs())
    const [dateTo, setDateTo] = useState(dayjs())
    let testArr = []
    let temps2Array = []

    
    if (temps !== undefined){
        testArr = temps.map(i => i.payload);
    }

    if (temps2 !== undefined) {
        temps2Array = temps2.map(i => i.payload);
    }

    function handleDateFromChange(event) {
        setDateFrom(event.target.value)
    }
    function handleDateToChange(event) {
        setDateTo(event.target.value)
    }

    useEffect(() => {
        const fetchTemps = async () => {
            const fetchedTemps = await GetTemps();
            setTemps(fetchedTemps);
        }

        fetchTemps();
    }, [])

    useEffect(() => {
        const dateFrom = "2024-02-20"
        const dateTo = "2024-02-28"

        const fetchTemps = async () => {
            const fetchedTemps2 = await GetTempsByDate(dateFrom, dateTo);
            console.log(fetchedTemps2)
            setTemps2(fetchedTemps2);
        }

        fetchTemps();
    }, [dateFrom, dateTo])

    console.log(temps)
    console.log(temps2)

    return (
        <div>
            <h1>Latest Temperatures</h1>


            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker', 'DatePicker']}>
                    {/*<DatePicker label="Uncontrolled picker" defaultValue={dayjs('2022-04-17')} />*/}
                    <DatePicker
                        label="Date From"
                        value={dayjs(dateFrom)}
                        onChange={handleDateFromChange}
                    />
                    <DatePicker
                        label="Date To"
                        value={dayjs(dateFrom)}
                        onChange={handleDateFromChange}
                    />
                </DemoContainer>
            </LocalizationProvider>
            <TempLineChart rawTemperatures={temps}/>
            

        </div>

    );
};
