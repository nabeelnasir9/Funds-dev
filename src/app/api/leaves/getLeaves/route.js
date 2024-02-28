import dbConnect from "../../../../utils/dbConnect";
import Leave from "../../../../models/leaveModel";
import authMiddleware from "../../../../utils/authMiddleware";
import { NextResponse } from "next/server";

// @ts-ignore
export const POST = async (request) => {
  try {
    await dbConnect();
    const { token,employee } = await request.json();

    console.log(token, "==================token=========");
    // Authenticate user
    const userId = await authMiddleware(token);
    let leavesRequests;
    if (employee) {
      leavesRequests = await Leave.find({userId:userId});
   } else {
    leavesRequests = await Leave.find();
   }

    // Convert createdAt and updatedAt dates to local string format

    return NextResponse.json({ message: "success", data: leavesRequests });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: error,
      message:
        "Something went wrong in the server while fetching cash requests",
    });
  }
};
