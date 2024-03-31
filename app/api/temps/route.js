import connectMongoDB from '../../lib/mongodb';
import Temperature from '../../../models/temperature';
import { NextRequest, NextResponse } from 'next/server';
import { URL, URLSearchParams } from 'url';


export async function GET(req){
    await connectMongoDB();
    const myUrl = new URL(req.url)

    //console.log(req)
    //console.log(req.method)
    //console.log(req.url)
    //console.log(new URL(req.url).searchParams.get("bla"))
    //console.log(myUrl)
    //console.log(myUrl.search)
    //console.log(myUrl.searchParams)
    //console.log(myUrl.searchParams.toString())
    //const { dateFrom, dateTo } = myUrl.searchParams
    //console.log(dateFrom)
    //console.log(dateTo)

    if (myUrl.searchParams.has("dateFrom") && myUrl.searchParams.has("dateTo")) {
        const dateFrom = myUrl.searchParams.get("dateFrom")
        const dateTo = myUrl.searchParams.get("dateTo")

        try {
            const temps = await Temperature.find({ 
                "timestamp": {
                    $gte: new Date(dateFrom),
                    $lte: new Date(dateTo)
                }
              });
            console.log("Temps:" + temps)
            //return res.status(200).json({ temps });
            return NextResponse.json({ temps })
          } catch (error) {
            //return res.status(500).json({ error: error.message });
            return NextResponse.json({ error: error.message })
          }
    }

    else {
        try{
            const temps = await Temperature.find().limit(20)

            return NextResponse.json({temps})
        }catch(err){
            console.log(err)
        }
    }
}