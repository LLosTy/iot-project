'use server'
import axiosInstance from "../axiosInstance"


export const GetTemps = async () => {
    try {
        const res = await axiosInstance.get('/temps');
        console.log("Called Axios to GET All temperatures");
        return res.data.temps;
    } catch (err) {
        console.log(err);
        throw new Error("Error fetching Temps from Database! \n" + err.message);
    }
}

export const GetTempsByDate = async (dateFrom, dateTo) => {
    try {
        const res = await axiosInstance.get(`/temps?dateFrom=${dateFrom}&dateTo=${dateTo}`);
        console.log("Called Axios to GET temperatures From and To specified date");
        return res.data.temps;
    } catch (err) {
        console.log(err);
        throw new Error("Error fetching Temps from Database! \n" + err.message);
    }
}

export const GetTempsByDevice = async (deviceId) => {
    try {
        const res = await axiosInstance.get(`/temps?device=${deviceId}`);
        console.log("Called Axios to GET temperatures by deviceId");
        return res.data.temps;
    } catch (err) {
        console.log(err);
        throw new Error("Error fetching Temps of the Device from Database! \n" + err.message);
    }
}