import User from "../../../../models/userModel";
import dbConnect from "../../../../utils/dbConnect";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import authMiddleware from "../../../../utils/authMiddleware";
import jwt from "jsonwebtoken";

export const POST = async (request) => {
  try {
    await dbConnect();
    const { id } = await request.json();

   
    let user = await User.deleteOne(
        { _id: id }
        );
    return NextResponse.json({ message: "success", status: 200});
  } catch (error) {
    return NextResponse.json({
      message: "Something went wrong in server login ",
      error: error,
    });
  }
};
