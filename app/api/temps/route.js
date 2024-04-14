import connectMongoDB from '../../lib/mongodb';
import Temperature from '../../../models/temperature';
import { NextResponse } from 'next/server';
import { URL } from 'url';


export async function GET(req){
    await connectMongoDB();
    try {
        const dateFrom = req.nextUrl.searchParams.get("dateFrom")
        const dateTo = req.nextUrl.searchParams.get("dateTo")
        const iotId = req.nextUrl.searchParams.get("iot")
        
        let query = {}
        
        if (req.nextUrl.searchParams.has("dateFrom") && req.nextUrl.searchParams.has("dateTo")) {  
            query.timestamp = {
                $gte: new Date(dateFrom),
                $lte: new Date(dateTo)
            }
        }
        else if (req.nextUrl.searchParams.has("iot")) {
            query.hardwareId = iotId
        }
        const temps = await Temperature.find(query)
            .limit( 
            (dateFrom && dateTo) || iotId ? 
                undefined 
            : 20
        ).lean()

        return NextResponse.json({ temps })

    } catch(error) {
        console.log(error)
        return NextResponse.json({ error: error.message })
    }
}