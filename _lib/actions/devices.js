// _lib/actions/devices.js

'use server'
import axiosInstance from "../../axiosInstance";

export const GetUserDevices = async (session, userId) => {
    try {
        const res = await axiosInstance.get(`/devices/?userId=${userId}`, {
            headers: {
                Authorization: `Bearer ${session.user.token}`,
            },
        });
        console.log("Called Axios to GET devices");
        return res.data;
    } catch (err) {
        console.log(err);
        throw new Error("Error fetching Devices from Database! \n" + err.message);
    }
};

export const GetDevice = async (session, deviceId) => {
    try {
        const res = await axiosInstance.get(`/devices/?device=${deviceId}`, {
            headers: {
                Authorization: `Bearer ${session.user.token}`,
            },
        });
        console.log("Called Axios to GET device");
        return res.data.devices;
    } catch (err) {
        console.log(err);
        throw new Error("Error fetching Device from Database! \n" + err.message);
    }
};

export const CreateDevice = async (session, deviceData) => {
    try {
        const res = await axiosInstance.put('/devices/create', deviceData, {
            headers: {
                Authorization: `Bearer ${session.user.token}`,
            },
        });
        console.log("Device created:", res.data.devices);
    } catch (err) {
        console.log(err);
        throw new Error("Error Creating Device in Database! \n" + err.message);
    }
};

export const UpdateDevice = async (session, deviceData) => {
    try {
        const res = await axiosInstance.put('/devices/update', deviceData, {
            headers: {
                Authorization: `Bearer ${session.user.token}`,
            },
        });
        return res.data.devices;
    } catch (err) {
        console.log(err);
        throw new Error("Error Updating Device in Database! \n" + err.message);
    }
};

export const DeleteDevice = async (session, deviceId) => {
    try {
        const res = await axiosInstance.delete(`/devices`, {
            headers: {
                Authorization: `Bearer ${session.user.token}`,
            },
            params: { deviceId }, // Make sure this is included and properly formatted
        });
        return res.data.devices;
    } catch (err) {
        console.log(err);
        throw new Error("Error Deleting Device in Database! \n" + err.message);
    }
};
