import dbConnect from "../../../../utils/dbConnect";
import Cash from "../../../../models/cashModel";
import authMiddleware from "../../../../utils/authMiddleware";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// @ts-ignore
export const POST = async (request) => {
  try {
    await dbConnect();
    const {amount,title,token,attachment} = await request.json();
    console.log(token,"====================");
    // const authorization = headers().get("Authorization");
    // console.log(authorization)
    let userId = await authMiddleware(token);
    console.log(userId, "user form db",request);
    

    console.log(title, "this is the data from for cash request");

    const newCash = new Cash({
      userId: userId,
      title,
      amount,
      status: "pending",
      attachment:attachment
    });

    const res = await newCash.save();
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
