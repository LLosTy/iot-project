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

export const GetTempsByIotId = async (iotId) => {
    try{
        const res = await fetch(`http://localhost:3000/api/temps?iot=${iotId}`, {
            cache: "no-store",
        });

        const data = await res.json()
        return data.temps;

    } catch (err){
        console.log(err)
        throw new Error("Error fetching Temps from Database! \n" + err.message)
    }
}