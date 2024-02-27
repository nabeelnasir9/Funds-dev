import User from "../../../../models/userModel";
import dbConnect from "../../../../utils/dbConnect";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import authMiddleware from "../../../../utils/authMiddleware";
import jwt from "jsonwebtoken";

export const POST = async (request) => {
  try {
    await dbConnect();
    const { token } = await request.json();

    console.log(token, "==================token=========");
    // Authenticate user
    const userId = await authMiddleware(token);
    if (!userId) {
      return NextResponse.json({ error: "Invalid credentials" });
    }
    let user = await User.findById(userId);
    return NextResponse.json({ message: "success", data: user });
  } catch (error) {
    return NextResponse.json({
      message: "Something went wrong in server login ",
      error: error,
    });
  }
};
