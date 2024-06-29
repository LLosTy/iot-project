import {LineChart} from "@mui/x-charts/LineChart";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {Box, IconButton, MenuItem, Select} from "@mui/material";
import React, {useEffect, useState} from 'react';
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import SearchIcon from '@mui/icons-material/Search';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import axiosInstance from "/axiosInstance";

//TODO This component should only take in area ID and handle showing them etc


function selectMaxSampleTemps(temperatures) {
    const maxSamples = 25;
    const sampleSize = Math.min(temperatures.length, maxSamples);
    const interval = temperatures.length / sampleSize;

    const sampledTemperatures = [];

    for (let i = 0; i < sampleSize; i++) {
        const index = Math.floor(i * interval);
        sampledTemperatures.push(temperatures[index]);
    }

    return sampledTemperatures.map(i => i.payload.temp);
}

const getIndex = (temperatures) => {
    let indexes = Array.from(Array(temperatures.length).keys())
    for(let index in indexes){
        indexes[index]++
    }
    return indexes
}


const TempLineChart = ({
    deviceId
}) => {
    const [rawTemperatures, setRawTemps] = useState([])
    const [temperatures, setTemperatures] = useState([])
    const maxTemp = Math.max(temperatures)
    const [tempsTimestamp,setTempsTimestamp] = useState([])

    const [interval, setInterval] = useState('day')
    dayjs.extend(utc);
    const [date, setDate] = useState(dayjs())
    const [dateTo, setDateTo] = useState(dayjs())

    const handleChange = (event) => {
        setInterval(event.target.value);
    };

    function handleDateChange(value) {
        setDate(value)
        console.log(value)
    }
    function handleDateToChange(value) {
        setDateTo(value)
        console.log(value)
    }

    useEffect(() => {
        handleSearch()
    }, []);

    function handleSearch(){
        axiosInstance.get(`/temps?dateFrom=${date}&device=${deviceId}`)
            .then(response => {
                if (Array.isArray(response.data.temps)) {
                    console.log(response.data.temps)
                    const tempsTimestamps = response.data.temps.map(temp => temp.timestamp);
                    const temps = response.data.temps.map(temp => temp.payload.temp);
                    console.log(temps)
                    setTemperatures(temps)
                    // const time = new Date(timestamp).toISOString().split('T')[1].split('Z')[0];
                    setTempsTimestamp(tempsTimestamps);
                    console.log("TIMESTAMPS",tempsTimestamps)
                } else {
                    console.error("response.data is not an array:", response.data);
                }
            }).catch(error => {
            // Handle error
            console.error('Caught Error', error);
        });
    }

    return(
    <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={4}
                    p={2}
                >
                    <DatePicker
                        label="Date"
                        value={date}
                        onChange={handleDateChange}
                    />
                    {/*<DatePicker*/}
                    {/*    label="Date To"*/}
                    {/*    value={dateTo}*/}
                    {/*    onChange={handleDateToChange}*/}
                    {/*/>*/}
                    {/*<Select*/}
                    {/*    labelId="demo-simple-select-label"*/}
                    {/*    id="demo-simple-select"*/}
                    {/*    value={interval}*/}
                    {/*    onChange={handleChange}*/}
                    {/*    sx={{width:120}}*/}
                    {/*>*/}
                    {/*    <MenuItem value={"day"}>Day</MenuItem>*/}
                    {/*    <MenuItem value={"hour"}>Hour</MenuItem>*/}
                    {/*    <MenuItem value={"quarter"}>15 min</MenuItem>*/}
                    {/*</Select>*/}
                    <IconButton onClick={handleSearch}><SearchIcon/></IconButton>
                </Box>
                <>
                { temperatures.length !== 0 ? <LineChart
                    xAxis={[{scaleType: 'point', data: tempsTimestamp}]}
                    series={[{data: temperatures}]}
                    height={400}
                /> : <p>No temperatures found</p>}
                </>
            </LocalizationProvider>
    </div>
    )
}
export default TempLineChart;

