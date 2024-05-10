import dbConnect from "../../../utils/dbConnect";
import Leave from "../../../models/leaveModel";
import Passout from "../../../models/passoutModel";
import User from "../../../models/userModel"; // Import User model if used
import authMiddleware from "../../../utils/authMiddleware";
import { NextResponse } from "next/server";

// @ts-ignore
export const POST = async (request) => {
  try {
    await dbConnect();
    const { token, employee ,admin} = await request.json();

    console.log(token, "==================token=========");
    // Authenticate user
    const userId = await authMiddleware(token);
    console.log("userId", userId);
    let leavesRequests;
    let passOutRequests;
      leavesRequests = await Leave.find({ userId: userId, status:"accept" }).populate("userId");
        passOutRequests = await Passout.find({ userId: userId, status: 'accept' }).populate(
            "userId"
        );
   

    // Convert createdAt and updatedAt dates to local string format

    leavesRequests = leavesRequests.map((leavesRequest) => ({
      ...leavesRequest.toObject(), // Convert Mongoose document to plain JavaScript object
      createdAt: new Date(leavesRequest.createdAt).toDateString(),

      username: leavesRequest.userId.username, // Add username to cash request object
    }));

    passOutRequests = passOutRequests.map((passoutRequest) => ({
      ...passoutRequest.toObject(), // Convert Mongoose document to plain JavaScript object
      createdAt: new Date(passoutRequest.createdAt).toDateString(),

      username: passoutRequest.userId.username, // Add username to cash request object
    }));

    const data = {
      leavesRequests,
      passOutRequests
    }




    return NextResponse.json({ message: "success", data: data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: "Internal Server Error", // Provide a more descriptive error message
      message:
        "Something went wrong in the server while fetching leave requests",
    });
  }
};
