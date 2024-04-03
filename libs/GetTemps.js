const GetTemps = async () => {
    try{
        const res = await fetch("http://localhost:3000/api/temps", {
            cache: "no-store",
        })
        return res.json();
    }catch (err){
        console.log(err)
    }
}

export default GetTemps