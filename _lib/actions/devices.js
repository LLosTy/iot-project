'use server'

export const GetTempsByDevice = async (deviceId) => {
    try{
        const res = await fetch(`http://localhost:3000/api/temps?device=${deviceId}`, {
            cache: "no-store",
        });

        const data = await res.json()
        return data.temps;

    } catch (err){
        console.log(err)
        throw new Error("Error fetching Temps of the Device from Database! \n" + err.message)
    }
}

export const GetDevices = async () => {
    try{
        const res = await fetch("http://localhost:3000/api/devices", {
            cache: "no-store",
        })
        const data = await res.json()
        
        return data.temps;

    } catch (err){
        console.log(err)
        throw new Error("Error fetching Devices from Database! \n" + err.message)
    }
}

export const CreateDevice = async() => {
    try{
        const res = await fetch("http://localhost:3000/api/devices", {
            cache: "no-store",
        });
        const data = await res.json();

        return data.temps;

    } catch (err){
        console.log(err)
        throw new Error("Error Creating Device in Database! \n" + err.message)
    }

}

export const UpdateDevice = async() => {
    try{
        const res = await fetch("http://localhost:3000/api/devices", {
            cache: "no-store",
        });
        const data = await res.json();

        return data.temps;

    } catch (err){
        console.log(err)
        throw new Error("Error Updating Device in Database! \n" + err.message)
    }
}

export const DeleteDevice = async() => {
    try{
        const res = await fetch("http://localhost:3000/api/devices", {
            cache: "no-store",
        });
        const data = await res.json();

        return data.temps;
        
    } catch (err){
        console.log(err)
        throw new Error("Error Deleting Device in Database! \n" + err.message)
    }
}