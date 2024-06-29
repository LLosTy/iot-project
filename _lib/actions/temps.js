'use server'
import axiosInstance from "../../axiosInstance"


export const GetTemps = async (session) => {
    try {
        const res = await axiosInstance.get('/temps', {
            headers: {
                Authorization: `Bearer ${session.user.token}`,
            },
        });
        console.log("Called Axios to GET All temperatures");
        return res.data.temps;
    } catch (err) {
        console.log(err);
        throw new Error("Error fetching Temps from Database! \n" + err.message);
    }
}

export const GetTempsByDate = async (session, dateFrom, dateTo) => {
    try {
        const res = await axiosInstance.get(`/temps?dateFrom=${dateFrom}&dateTo=${dateTo}`, {
            headers: {
                Authorization: `Bearer ${session.user.token}`,
            },
        });
        console.log("Called Axios to GET temperatures From and To specified date");
        return res.data.temps;
    } catch (err) {
        console.log(err);
        throw new Error("Error fetching Temps from Database! \n" + err.message);
    }
}

export const GetTempsByDevice = async (session, deviceId) => {
    try {
        const res = await axiosInstance.get(`/temps?device=${deviceId}`, {
            headers: {
                Authorization: `Bearer ${session.user.token}`,
            },
        });
        console.log("Called Axios to GET temperatures by deviceId");
        return res.data.temps;
    } catch (err) {
        console.log(err);
        throw new Error("Error fetching Temps of the Device from Database! \n" + err.message);
    }
}