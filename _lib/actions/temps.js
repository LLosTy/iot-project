'use server'


export const GetTemps = async () => {
    try{
        const res = await fetch("http://localhost:3000/api/temps", {
            cache: "no-store",
        })
        const data = await res.json()
        
        return data.temps;

    } catch (err){
        console.log(err)
        throw new Error("Error fetching Temps from Database! \n" + err.message)
    }
}

export const GetTempsByDate = async (dateFrom, dateTo) => {
    try{
        const res = await fetch(`http://localhost:3000/api/temps?dateFrom=${dateFrom}&dateTo=${dateTo}`, {
            cache: "no-store",
        });

        const data = await res.json()
        return data.temps;

    } catch (err){
        console.log(err)
        throw new Error("Error fetching Temps from Database! \n" + err.message)
    }
}

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