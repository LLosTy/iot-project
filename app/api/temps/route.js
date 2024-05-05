import connectMongoDB from '../../../_lib/mongodb';
import Temperature from '../../../_models/temperature';
import { NextResponse } from 'next/server';


export async function GET(req){
    await connectMongoDB();
    try {
        const dateFrom = req.nextUrl.searchParams.get("dateFrom")
        const dateTo = req.nextUrl.searchParams.get("dateTo")
        const deviceId = req.nextUrl.searchParams.get("device")
        
        let query = {}
        
        if (req.nextUrl.searchParams.has("dateFrom") && req.nextUrl.searchParams.has("dateTo")) {  
            query.timestamp = {
                $gte: new Date(dateFrom),
                $lte: new Date(dateTo)
            }
        }
        else if (req.nextUrl.searchParams.has("device")) {
            query.hardwareId = deviceId
        }

        console.log(query)
        const temps = await Temperature.find(query)
            .limit( 
            (dateFrom && dateTo) || deviceId ? 
                undefined 
            : 20
        ).lean()
        console.log(temps)

        return NextResponse.json({ temps })

    } catch(error) {
        console.log(error)
        return NextResponse.json({ error: error.message })
    }
}