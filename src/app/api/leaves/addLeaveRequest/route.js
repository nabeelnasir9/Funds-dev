import dbConnect from "../../../../utils/dbConnect";
import Leave from "../../../../models/leaveModel";
import authMiddleware from "../../../../utils/authMiddleware";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import cloudinary from "../../../../lib/config/cloudinary"
import imgss from "../../../../imgs/test.png"
// @ts-ignore
export const POST = async (request) => {
  try {
    await dbConnect();
    const { reasons, name, leave, token, date_from,date_to, number_of_days,attachment} = await request.json();
    console.log("date_fromeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",date_from,date_to,number_of_days)

    // const result = await cloudinary.uploader.upload(attachment);
    console.log(attachment,"attachment");
    // const authorization = headers().get("Authorization");
    // console.log(authorization)
    let userId = await authMiddleware(token);


    const newLeave = new Leave({
      userId: userId,
      title: name,
      attachment:attachment,
      reason:reasons,
      leaveType: leave,
      dateFrom:date_from,
      dateTo:date_to,
      numberOfDays:number_of_days
      // leaveDate: date,
    });
    

    console.log(newLeave, "newLeave")

    const res = await newLeave.save();

    return NextResponse.json({ message: "success", data: "res" });
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json({
      error: error,
      message: "Something went wrong in server while add cash request",
    });
  }
};
