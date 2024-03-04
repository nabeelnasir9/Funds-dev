import dbConnect from "../../../../utils/dbConnect";
import Leave from "../../../../models/leaveModel";
import User from "../../../../models/userModel"; // Import User model if used
import authMiddleware from "../../../../utils/authMiddleware";
import { NextResponse } from "next/server";

// @ts-ignore
export const POST = async (request) => {
  try {
    await dbConnect();
    const { token, employee } = await request.json();

    console.log(token, "==================token=========");
    // Authenticate user
    const userId = await authMiddleware(token);
    let leavesRequests;
    if (employee) {
      leavesRequests = await Leave.find({ userId: userId });
    } else {
      let leavesReq = await Leave.find(); // Declare leavesReq
      leavesRequests = await Promise.all(
        leavesReq.map(async (req) => {
          let reqUser = await User.findById(req.userId); // Assuming User model is imported

          if (reqUser.hr == userId || reqUser.manager == userId) {
            return req;
          } else {
            return null;
          }
        })
      );
      leavesRequests = leavesRequests.filter((req) => req !== null); // Remove null entries
    }

    // Convert createdAt and updatedAt dates to local string format

    return NextResponse.json({ message: "success", data: leavesRequests });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: "Internal Server Error", // Provide a more descriptive error message
      message: "Something went wrong in the server while fetching leave requests",
    });
  }
};
