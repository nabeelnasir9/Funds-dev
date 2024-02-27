


import dbConnect from "../../../../utils/dbConnect";
import Users from "../../../../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// @ts-ignore
export const POST = async (request) => {
  try {
    await dbConnect();
    const { username, email, password,role } = await request.json();

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("in api calling", "hash", username, email, password);

    const newUser = new Users({
      username,
      email,
      password: hashedPassword,
      role
    });

    const savedUser = await newUser.save();
    console.log(savedUser, "data saved");

    // Generate a JWT token
    const token = jwt.sign(
      { userId: savedUser._id }, // Payload: Include any additional data you want to encode
      process.env.JWT_SECRET,   // Secret key for signing the token
      { expiresIn: "10h" }       // Expiration time for the token
    ); 

    return NextResponse.json({ message: "success", token :token,savedUser:savedUser});
  } catch (error) {
    console.error(error, "error");
    return NextResponse.json({
      error: error.message,
      message: "Something went wrong in server",
    });
  }
};
