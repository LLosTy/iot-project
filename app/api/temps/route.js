import connectMongoDB from '/libs/mongodb'
import Temperature from '/models/temperature'
import { NextResponse } from "next/server";

export async function GET(){
    await connectMongoDB();
    // try{
        const temps = await Temperature.find().limit(20)
        // console.log(temps[0])
        return NextResponse.json({temps})
    // }catch(err){
    //     console.log(err)
    // }
}