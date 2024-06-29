
// app/temps/page.js
'use client'
// import Temperature from '/models/temperature'
import React from "react";
import { useState, useEffect } from "react";
// import { LineChart } from '@mui/x-charts/LineChart';
import { GetTemps, GetTempsByDate } from '/_lib/actions/temps'
import TempLineChart from '/_components/TempLineChart'
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useSession } from "next-auth/react";


export default function TempsPage(){
    const [temps, setTemps] = useState([])
    const [temps2, setTemps2] = useState([])
    const [dateFrom, setDateFrom] = useState(dayjs())
    const [dateTo, setDateTo] = useState(dayjs())
    const { data: session, status } = useSession()
    let testArr = []
    let temps2Array = []
    const isLoading = status === "loading";

    
    if (temps !== undefined){
        testArr = temps.map(i => i.payload);
    }

    if (temps2 !== undefined) {
        temps2Array = temps2.map(i => i.payload);
    }

    function handleDateFromChange(value) {
        setDateFrom(value)
    }
    function handleDateToChange(value) {
        setDateTo(value)
    }

    useEffect(() => {
        const fetchTemps = async () => {
            if (!isLoading && session){
                const fetchedTemps = await GetTemps(session);
                setTemps(fetchedTemps);
            }
        }
        fetchTemps();
    }, [session, isLoading])

    useEffect(() => {
        const fetchTemps = async () => {
            if (!isLoading && session){
                const formmatedDateFrom = dateFrom.format("YYYY-MM-DD")
                const formattedDateTo = dateTo.format("YYYY-MM-DD")
                const fetchedTemps2 = await GetTempsByDate(session, formmatedDateFrom, formattedDateTo);
                setTemps2(fetchedTemps2);
            }
        }
        fetchTemps();
    }, [session, isLoading, dateFrom, dateTo])

    return (
        <div>
            <h1>Latest Temperatures</h1>


            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker', 'DatePicker']}>
                    {/*<DatePicker label="Uncontrolled picker" defaultValue={dayjs('2022-04-17')} />*/}
                    <DatePicker
                        label="Date From"
                        value={dateFrom}
                        onChange={handleDateFromChange}
                    />
                    <DatePicker
                        label="Date To"
                        value={dateTo}
                        onChange={handleDateToChange}
                    />
                </DemoContainer>
            </LocalizationProvider>

            {(temps2?.length > 0)?
            <TempLineChart rawTemperatures={temps2}/>            
            : null}

            {temps?.length > 0? 
            <TempLineChart rawTemperatures={temps}/>
            :null}
            
        </div>

    );
};
