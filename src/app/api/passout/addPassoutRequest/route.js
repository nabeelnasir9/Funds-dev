import dbConnect from "../../../../utils/dbConnect";
import Passout from "../../../../models/passoutModel";
import authMiddleware from "../../../../utils/authMiddleware";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// @ts-ignore
export const POST = async (request) => {
  try {
    await dbConnect();
    const { reason, name, passOut, token } = await request.json();
    console.log(token, "====================", name, passOut, reason);
    // const authorization = headers().get("Authorization");
    // console.log(authorization)
    let userId = await authMiddleware(token);
    console.log(userId, "user form db");

    const newPassout = new Passout({
      userId: userId,
      title: name,
      reason,

      passOut,
    });

    const res = await newPassout.save();
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
