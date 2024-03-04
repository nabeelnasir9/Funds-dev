import User from '../../../../models/userModel';
import dbConnect from '../../../../utils/dbConnect';
import { NextResponse } from 'next/server';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';


export const POST = async (request) => {
    try {
      await dbConnect();
      const { email, password } = await request.json();
      const user = await User.findOne({ email }).select('+password');
  
      if (!user) {
        return NextResponse.json({ error: "Invalid credentials" });
      }
    //   console.log(user, "user from db");
    const hashedPassword = await bcrypt.hash(password, 10);
    const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return NextResponse.json({ error: "Invalid credentials" });
      }
      console.log(passwordMatch, "password ");
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '10h' });
      // Passwords match, login successful
      return NextResponse.json({ message: "success", data: user, token });
    } catch (error) {
      return NextResponse.json({
        message: "Something went wrong in server login ",
        error: error,

      });
    }
  };
  