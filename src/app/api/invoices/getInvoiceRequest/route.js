import dbConnect from "../../../../utils/dbConnect";
import Invoice from "../../../../models/invoiceModel";
import authMiddleware from "../../../../utils/authMiddleware";
import User from "../../../../models/userModel"; // Import User model if used

import { NextResponse } from "next/server";

// @ts-ignore
export const POST = async (request) => {
  try {
    await dbConnect();
    const { token, employee,admin } = await request.json();

    console.log(token, "==================token=========");
    // Authenticate user
    const userId = await authMiddleware(token);

    // Fetch cash requests for the authenticated user
    let passoutRequests;
    if (admin) {
      passoutRequests = await Invoice.find().populate("userId");
    } else if (employee) {
      passoutRequests = await Invoice.find({ userId: userId }).populate(
        "userId"
      );
    } else {
      let passoutReq = await Invoice.find().populate("userId"); // Declare leavesReq
      passoutRequests = await Promise.all(
        passoutReq.map(async (req) => {
          let reqUser = await User.findById(req.userId); // Assuming User model is imported

          if (
            reqUser.hr == userId ||
            reqUser.manager == userId ||
            reqUser.accountant == userId
          ) {
            return req;
          } else {
            return null;
          }
        })
      );
      passoutRequests = passoutRequests.filter((req) => req !== null); // Remove null entries
    }
    // Convert createdAt and updatedAt dates to local string format
    passoutRequests = passoutRequests.map((passoutRequest) => ({
      ...passoutRequest.toObject(), // Convert Mongoose document to plain JavaScript object
      createdAt: new Date(passoutRequest.createdAt).toDateString(),

      username: passoutRequest.userId.username, // Add username to cash request object
    }));
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
