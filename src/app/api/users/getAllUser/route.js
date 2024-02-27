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
    let users = await User.find();

  let  newUsers = users.map(user => ({
      ...user.toObject(), // Convert Mongoose document to plain JavaScript object
      createdAt: new Date(user.createdAt).toDateString(),
    }));
    return NextResponse.json({ message: "success", data: newUsers });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Something went wrong in server login ",
      error: error,
    });
  }
};
