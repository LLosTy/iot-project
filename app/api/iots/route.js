import connectMongoDB from '../../lib/mongodb';
import Iot from '../../../models/iot';
import { NextResponse, NextRequest } from 'next/server';
import { URL } from 'url';


  export async function GET(req){
    await connectMongoDB();
    try {
        const iotId = req.nextUrl.searchParams.get("iot")
        let query = {}
        
        if (req.nextUrl.searchParams.has("iot")) {
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


  export async function POST(req) {
    await connectMongoDB();
    try {
        const data = await req.json()


        const iots ={}

        return NextResponse.json({ iots })

    } catch(error) {
        console.log(error)
        return NextResponse.json({ error: error.message })
    }
  }
  
  export async function PUT(req) {
    await connectMongoDB();
    try {
        const data = await req.json()
        
        let query = {}
        
        if (req.nextUrl.searchParams.has("iot")) {
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