import connectMongoDB from '../../lib/mongodb';
import Temperature from '../../../models/temperature';
import { NextResponse } from "next/server";

export async function GET(req){
    await connectMongoDB();


    // try{
        const temps = await Temperature.find().limit(20)
        // console.log(temps)
        return NextResponse.json({temps})
    // }catch(err){
    //     console.log(err)
    // }
}