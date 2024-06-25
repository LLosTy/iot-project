'use server'
import axiosInstance from "../../axiosInstance"


export const GetUserDevices = async (userId) => {
    try {
        const res = await axiosInstance.get(`/devices?userId=${userId}`); // Change user to userId
        console.log("Called Axios to GET devices");
        return res.data;
    } catch (err) {
        console.log(err);
        throw new Error("Error fetching Devices from Database! \n" + err.message);
    }
}

export const GetDevice = async (deviceId) => {
    try {
        const res = await axiosInstance.get(`/devices?device=${deviceId}`);
        console.log("Called Axios to GET device");
        return res.data.devices;
    } catch (err) {
        console.log(err);
        throw new Error("Error fetching Device from Database! \n" + err.message);
    }
}

export const CreateDevice = async (deviceData) => {
    try {
        const res = await axiosInstance.put('/devices', deviceData);
        console.log("Device created:", res.data.devices);
    } catch (err) {
        console.log(err);
        throw new Error("Error Creating Device in Database! \n" + err.message);
    }
}

export const UpdateDevice = async (deviceData) => {
    try {
        const res = await axiosInstance.put('/devices', deviceData);
        return res.data.devices;
    } catch (err) {
        console.log(err);
        throw new Error("Error Updating Device in Database! \n" + err.message);
    }
}

export const DeleteDevice = async (deviceId) => {
    try {
        const res = await axiosInstance.delete(`/devices?device=${deviceId}`);
        return res.data.devices;
    } catch (err) {
        console.log(err);
        throw new Error("Error Deleting Device in Database! \n" + err.message);
    }
}