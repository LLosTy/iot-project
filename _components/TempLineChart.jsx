import {LineChart} from "@mui/x-charts/LineChart";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {Box, IconButton, MenuItem, Select} from "@mui/material";
import React, {useEffect, useState} from 'react';
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import SearchIcon from '@mui/icons-material/Search';
import dayjs from "dayjs";
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
    rawTemperatures,deviceId
}) => {
    const temperatures = selectMaxSampleTemps(rawTemperatures)
    const maxTemp = Math.max(temperatures)
    const temperaturesIndex = getIndex(temperatures)

    const [interval, setInterval] = useState('day')
    const [dateFrom, setDateFrom] = useState(dayjs())
    const [dateTo, setDateTo] = useState(dayjs())

    const handleChange = (event) => {
        setInterval(event.target.value);
    };

    function handleDateFromChange(value) {
        setDateFrom(value)
        console.log(value)
    }
    function handleDateToChange(value) {
        setDateTo(value)
        console.log(value)
    }

    function handleSearch(){
        axiosInstance.get(`/temps?dateFrom=${dateFrom}&dateTo=${dateTo}&device=${deviceId}`)
            .then(response => {
                console.log(response.data)
                response.data.forEach((temp) => {console.log(temp)})
            })
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
                        label="Date From"
                        value={dateFrom}
                        onChange={handleDateFromChange}
                    />
                    <DatePicker
                        label="Date To"
                        value={dateTo}
                        onChange={handleDateToChange}
                    />
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={interval}
                        onChange={handleChange}
                        sx={{width:120}}
                    >
                        <MenuItem value={"day"}>Day</MenuItem>
                        <MenuItem value={"hour"}>Hour</MenuItem>
                        <MenuItem value={"quarter"}>15 min</MenuItem>
                    </Select>
                    <IconButton onClick={handleSearch}><SearchIcon/></IconButton>
                </Box>
                <LineChart
                    xAxis={[{ scaleType: 'point', data: temperaturesIndex}]}
                    series={[{data: temperatures}]}
                    height={400}
                />
            </LocalizationProvider>
    </div>
    )
}
export default TempLineChart;

