import dbConnect from "../../../../utils/dbConnect";
import Leave from "../../../../models/leaveModel";
import authMiddleware from "../../../../utils/authMiddleware";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// @ts-ignore
export const POST = async (request) => {
  try {
    await dbConnect();
    const { reasons, name, leave, token, date } = await request.json();
    console.log(token, "====================", name, leave, date, reasons);
    // const authorization = headers().get("Authorization");
    // console.log(authorization)
    let userId = await authMiddleware(token);
    console.log(userId, "user form db");


    const newLeave = new Leave({
      userId: userId,
      title: name,
      reason:reasons,

      leaveType: leave,
      leaveDate: date,
    });

    const res = await newLeave.save();
    console.log(res, "request saved");

    return NextResponse.json({ message: "success", data: "res" });
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json({
      error: error,
      message: "Something went wrong in server while add cash request",
    });
  }
};
