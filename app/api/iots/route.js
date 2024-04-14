import connectMongoDB from '../../lib/mongodb';
import Iot from '../../../models/iot';
import { NextResponse } from 'next/server';
import { URL } from 'url';


  export async function GET(req){
    await connectMongoDB();
    try {
        console.log(req.qu)
        console.log(req.body)
        const myUrl = new URL(req.url)
        console.log(myUrl)
        const iotId = myUrl.searchParams.get("iot")
        
        let query = {}
        
        if (myUrl.searchParams.has("iot")) {
            query.hardwareId = iotId
        }
        const iots = await Iot.find(query)
            .limit( 
            iotId ? 
                undefined 
            : 20
        ).lean()

        return NextResponse.json({ iots })

    } catch(error) {
        console.log(error)
        return NextResponse.json({ error: error.message })
    }
  }


  export async function POST(req, res) {
    await connectMongoDB();
    try {
        const myUrl = new URL(req.url)

        const iots = await Iot.insertMany

        return NextResponse.json({ iots })

    } catch(error) {
        console.log(error)
        return NextResponse.json({ error: error.message })
    }
  }
  
  export async function PUT(req) {
    await connectMongoDB();
    try {
        const myUrl = new URL(req.url)
        const iotId = myUrl.searchParams.get("iot")
        
        let query = {}
        
        if (myUrl.searchParams.has("iot")) {
            query.hardwareId = iotId
        }
        const iots = await Iot.find(query)
            .limit( 
            iotId ? 
                undefined 
            : 20
        ).lean()

        return NextResponse.json({ iots })

    } catch(error) {
        console.log(error)
        return NextResponse.json({ error: error.message })
    }
  }