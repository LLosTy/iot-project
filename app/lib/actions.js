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

export const GetTempsByDate = async (dateRange) => {
    console.log(dateRange)

    try{
        const res2 = await fetch(`http://localhost:3000/api/temps/${dateRange}`, {
            cache: "no-store",
        });
        if (!res2.ok) {
            // Log error response or handle accordingly
            console.error('Fetch error:', await res2.text());
            return;
        }
        //console.log(res2)
        const data = await res2.json()

        return data.temps;

    } catch (err){
        console.log(err)
        throw new Error("Error fetching Temps from Database! \n" + err.message)
    }
}