// api/temps/[dateRange]/route.js
import connectMongoDB from '../../../lib/mongodb';
import Temperature from '../../../../models/temperature';
import { NextResponse, NextRequest } from "next/server";


export async function GET(req, res) {
  await connectMongoDB();
  //console.log(req)
  //console.log(req.url)
  const tempArray = req.url.split("/")
  //console.log(tempArray)
  //console.log(typeof(tempArray))
  console.log(tempArray[(tempArray.length-1)])
  console.log("Search Params:" + req.searchParams)


  const dateRange = tempArray[(tempArray.length-1)]; // Assuming dateRange is something like '2023-01-01_to_2023-01-31'
  console.log("Date range:" + dateRange)
  const [dateFrom, dateTo] = dateRange.split('_to_');
  console.log(dateFrom)
  console.log(dateTo)

  //console.log(res)
  //console.log(typeof(res))
  try {
    const temps = await Temperature.find({ 
        "timestamp": {
            $gte: dateFrom,
            //$lte: new Date(dateTo).toISOString
        }
      });
    console.log("Temps:" + temps)
    //return res.status(200).json({ temps });
    return NextResponse.json({ temps })
  //try {
  //  res.status(200).json("Successfull load");
  } catch (error) {
    //return res.status(500).json({ error: error.message });
    return NextResponse.json({ error: error.message })
  }
}