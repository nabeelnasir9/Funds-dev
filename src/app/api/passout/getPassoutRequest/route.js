import dbConnect from "../../../../utils/dbConnect";
import Passout from "../../../../models/passoutModel";
import authMiddleware from "../../../../utils/authMiddleware";
import { NextResponse } from "next/server";

// @ts-ignore
export const POST = async (request) => {
  try {
    await dbConnect();
    const { token } = await request.json();

    console.log(token, "==================token=========");
    // Authenticate user
    const userId = await authMiddleware(token);

    // Fetch cash requests for the authenticated user
    let passoutRequests = await Passout.find({ userId });

    // Convert createdAt and updatedAt dates to local string format

    return NextResponse.json({ message: "success", data: passoutRequests });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: error,
      message:
        "Something went wrong in the server while fetching cash requests",
    });
  }
};
