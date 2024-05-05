'use server'

export const GetUserDevices = async (userId) => {
    try{
        const res = await fetch(`http://localhost:3000/api/devices?user=${userId}`, {
            cache: "no-store",
        })
        console.log("Called Fetch to GET devices")
        const data = await res.json()
        
        return data.devices;

    } catch (err){
        console.log(err)
        throw new Error("Error fetching Devices from Database! \n" + err.message)
    }
}

export const GetDevice = async (deviceId) => {
    try{
        const res = await fetch(`http://localhost:3000/api/devices?device=${deviceId}`, {
            cache: "no-store",
        })
        console.log("Called Fetch to GET devices")
        const data = await res.json()
        
        return data.devices;

    } catch (err){
        console.log(err)
        throw new Error("Error fetching Devices from Database! \n" + err.message)
    }
}

export const CreateDevice = async(deviceData) => {
    try{
        const res = await fetch("http://localhost:3000/api/devices", {
            method: "POST", // Changed method to POST
            headers: {
                "Content-Type": "application/json" // Added content type header
            },
            body: JSON.stringify(deviceData), // Sending an empty object for creating a new device
            cache: "no-store",
        });
        const data = await res.json();
        console.log(data.devices)
        
        
    } catch (err){
        console.log(err)
        throw new Error("Error Creating Device in Database! \n" + err.message)
    }

}

export const UpdateDevice = async(deviceData) => {
    try{
        const res = await fetch("http://localhost:3000/api/devices",  {
            method: "PUT", // Changed method to POST
            headers: {
                "Content-Type": "application/json" // Added content type header
            },
            body: JSON.stringify(deviceData), // Sending an empty object for creating a new device
            cache: "no-store",
        });
        const data = await res.json();

        return data.devices;

    } catch (err){
        console.log(err)
        throw new Error("Error Updating Device in Database! \n" + err.message)
    }
}

export const DeleteDevice = async(deviceId) => {
    try{
        const res = await fetch(`http://localhost:3000/api/devices?device=${deviceId}`,  {
            method: "DELETE", // Changed method to POST
            cache: "no-store",
         });
        const data = await res.json();

        return data.devices;
        
    } catch (err){
        console.log(err)
        throw new Error("Error Deleting Device in Database! \n" + err.message)
    }
}