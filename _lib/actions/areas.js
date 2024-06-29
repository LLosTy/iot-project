'use server'
import axiosInstance from "../../axiosInstance"

export const CreateArea = async (session, areaData) => {
    try {
        const res = await axiosInstance.put('/areas/create', areaData, {
            headers: {
                Authorization: `Bearer ${session.user.token}`,
            },
        });
        console.log("Called Axios to CREATE area");
        return res.data;
    } catch (err) {
        console.log(err);
        throw new Error("Error creating area in Database! \n" + err.message);
    }
}

export const DeleteArea = async (session, areaId, userId) => {
    try {
        const res = await axiosInstance.delete(`/areas?areaId=${areaId}&userId=${userId}`, {
            headers: {
                Authorization: `Bearer ${session.user.token}`,
            },
        });
        console.log("Called Axios to DELETE area");
        return res.data;
    } catch (err) {
        console.log(err);
        throw new Error("Error deleting area from Database! \n" + err.message);
    }
}

export const GetArea = async (session, areaId) => {
    try {
        const res = await axiosInstance.get(`/areas/getArea?areaId=${areaId}`, {
            headers: {
                Authorization: `Bearer ${session.user.token}`,
            },
        });
        console.log("Called Axios to GET area");
        return res.data;
    } catch (err) {
        console.log(err);
        throw new Error("Error fetching area from Database! \n" + err.message);
    }
}

export const GetUserAreas = async (session, userId) => {
    try {
        const res = await axiosInstance.get(`/areas/getUserAreas?userId=${userId}`, {
            headers: {
                Authorization: `Bearer ${session.user.token}`,
            },
        });
        console.log("Called Axios to GET user area");
        return res.data;
    } catch (err) {
        console.log(err);
        throw new Error("Error fetching user area from Database! \n" + err.message);
    }
}

export const UpdateAreaName = async (session, areaData) => {
    try {
        const res = await axiosInstance.put('/areas/updateAreaName', areaData, {
            headers: {
                Authorization: `Bearer ${session.user.token}`,
            },
        });
        console.log("Called Axios to UPDATE area name");
        return res.data;
    } catch (err) {
        console.log(err);
        throw new Error("Error updating area name in Database! \n" + err.message);
    }
}

export const AddViewer = async (session, userEmail, areaId) => {
    try {
        const res = await axiosInstance.put(`/areas/addViewer?userEmail=${userEmail}&areaId=${areaId}`, null, {
            headers: {
                Authorization: `Bearer ${session.user.token}`,
            },
        });
        console.log("Called Axios to ADD viewer to area");
        return res.data;
    } catch (err) {
        console.log(err);
        throw new Error("Error adding viewer to area in Database! \n" + err.message);
    }
}

export const RemoveViewer = async (session, userId, areaId) => {
    try {
        const res = await axiosInstance.put(`/areas/removeViewer?userId=${userId}&areaId=${areaId}`, null, {
            headers: {
                Authorization: `Bearer ${session.user.token}`,
            },
        });
        console.log("Called Axios to REMOVE viewer from area");
        return res.data;
    } catch (err) {
        console.log(err);
        throw new Error("Error removing viewer from area in Database! \n" + err.message);
    }
}

export const SetThreshold = async (session, thresholdData) => {
    try {
        const res = await axiosInstance.put('/areas/setThreshold', thresholdData, {
            headers: {
                Authorization: `Bearer ${session.user.token}`,
            },
        });
        console.log("Called Axios to SET threshold for area");
        return res.data;
    } catch (err) {
        console.log(err);
        throw new Error("Error setting threshold for area in Database! \n" + err.message);
    }
}

export const AcknowledgeArea = async (session, acknowledgeData) => {
    try {
        const res = await axiosInstance.post('/areas/acknowledge', acknowledgeData, {
            headers: {
                Authorization: `Bearer ${session.user.token}`,
            },
        });
        console.log("Called Axios to ACKNOWLEDGE area");
        return res.data;
    } catch (err) {
        console.log(err);
        throw new Error("Error acknowledging area in Database! \n" + err.message);
    }
}
