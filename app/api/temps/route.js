import connectMongoDB from '../../lib/mongodb';
import Temperature from '../../../models/temperature';
import { NextResponse } from 'next/server';
import { URL } from 'url';


export async function GET(req){
    await connectMongoDB();
    try {
        const myUrl = new URL(req.url)
        const dateFrom = myUrl.searchParams.get("dateFrom")
        const dateTo = myUrl.searchParams.get("dateTo")
        const iotId = myUrl.searchParams.get("iot")
        
        let query = {}
        
        if (myUrl.searchParams.has("dateFrom") && myUrl.searchParams.has("dateTo")) {  
            query.timestamp = {
                $gte: new Date(dateFrom),
                $lte: new Date(dateTo)
            }
        }
        else if (myUrl.searchParams.has("iot")) {
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