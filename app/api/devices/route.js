import connectMongoDB from '../../../_lib/mongodb';
import Device from '../../../_models/device';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';


  export async function GET(req){
    await connectMongoDB();

    try {
        const devicesId = req.nextUrl.searchParams.get("device")
        const userId = req.nextUrl.searchParams.get("user")
        let query = {}
        
        if (!devicesId || !userId) {
            return NextResponse.json({ error: "Please specify device ID or user ID!" });
        }

        if (devicesId) {
            query.hardwareId = devicesId;
        } else if (userId) {
            query.userId = userId;
        }

        const devices = await Device.find(query)
            .limit( devicesId || userId ? undefined : 20)
            .populate("userId")
            .lean()
        console.log("User Devices:", devices)

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
        console.log("Device data:", data)

        if (!Array.isArray(data) || data.length === 0) {
            return NextResponse.json({ error: "No devices data provided or data format is invalid!" });
        }

        const devices = Device.insertMany(data)

        if (!devices || devices.length === 0) {
            return NextResponse.json({ error: "Failed to create devices!" });
        }

        return NextResponse.json({ message: "Successfully created devices", devices });


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
        const { _id, ...updateData } = data;

        if (!_id) {
            return NextResponse.json({ error: "Device ID wasn't specified!!" });
        }

        const isValidObjectId = mongoose.isValidObjectId(_id);
        if (!isValidObjectId) {
            return NextResponse.json({ error: "Invalid Device ID format!" });
        }

        const updatedDevice = await Device.findByIdAndUpdate(_id, updateData, {
            new: true,
            runValidators: true, 
        }).populate("userId").lean()

        if (!updatedDevice) {
            return NextResponse.json({ error: "Device not found!" });
        }

        return NextResponse.json({ updatedDevice })

    } catch(error) {
        console.log(error)
        return NextResponse.json({ error: error.message })
    }
  }

  export async function DELETE(req) {
    await connectMongoDB();
    try {
        const deviceId = req.nextUrl.searchParams.get("device")

        if (!deviceId) {
            return NextResponse.json({ message: "Device ID wasn't specified!!" });
        }

        const isValidObjectId = mongoose.isValidObjectId(deviceId);
        if (!isValidObjectId) {
            return NextResponse.json({ message: "Invalid Device ID format!" });
        }

        const deletedDevice = await Device.findByIdAndDelete(deviceId);

        if (!deletedDevice) {
            return NextResponse.json({ message: "Device not found!" });
        }

        return NextResponse.json({ message: "Successfully deleted IoT Device" });

    } catch(error) {
        console.log(error)
        return NextResponse.json({ error: error.message })
    }
  }