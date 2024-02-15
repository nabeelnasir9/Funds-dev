
import { NextResponse } from 'next/server';

export const GET = async (request) => {
    try {
      
      return NextResponse.json({ message: "Server running v1" });
    } catch (error) {
      return NextResponse.json({
        error: "Something went wrong in server login ",
      });
    }
  };
  