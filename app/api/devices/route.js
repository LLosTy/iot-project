import connectMongoDB from '../../../_lib/mongodb';
import Device from '../../../_models/device';
import { NextResponse, NextRequest } from 'next/server';
import { URL } from 'url';


  export async function GET(req){
    await connectMongoDB();
    try {
        const devicesId = req.nextUrl.searchParams.get("devices")
        let query = {}
        
        if (req.nextUrl.searchParams.has("devices")) {
            query.hardwareId = devicesId
        }
        const devices = await Device.find(query)
            .limit( 
            devicesId ? 
                undefined 
            : 20
        ).lean()

        return NextResponse.json({ devices })

    } catch(error) {
        console.log(error)
        return NextResponse.json({ error: error.message })
    }
  }


  export async function POST(req) {
    await connectMongoDB();
    try {
        const data = await req.json()


        const devices ={}

        return NextResponse.json({ devices })

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
        
        if (req.nextUrl.searchParams.has("devices")) {
            query.hardwareId = devicesId
        }
        const devices = await Device.findByIdAndUpdate(query)
            .limit( 
            devicesId ? 
                undefined 
            : 20
        ).lean()

        return NextResponse.json({ devices })

    } catch(error) {
        console.log(error)
        return NextResponse.json({ error: error.message })
    }
  }

  export async function DELETE(req) {
    await connectMongoDB();
    try {
        const data = await req.json()
        
        let query = {}
        
        if (req.nextUrl.searchParams.has("devices")) {
            query.hardwareId = devicesId
        }
        const devices = await Device.findByIdAndDelete(query)
            .limit( 
            devicesId ? 
                undefined 
            : 20
        ).lean()

        return NextResponse.json({ devices })

    } catch(error) {
        console.log(error)
        return NextResponse.json({ error: error.message })
    }
  }