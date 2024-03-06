import dbConnect from "../../../../utils/dbConnect";
import Cash from "../../../../models/cashModel";
import User from "../../../../models/userModel";
import authMiddleware from "../../../../utils/authMiddleware";
import { NextResponse } from "next/server";

// @ts-ignore
export const POST = async (request) => {
  try {
    await dbConnect();
    const { token, employee } = await request.json();

    console.log(employee, "==================token=========");
    // Authenticate user
    const userId = await authMiddleware(token);

    // Fetch cash requests for the authenticated user
    let cashRequests;
    if (employee) {
      cashRequests = await Cash.find({ userId: userId }).populate('userId');;
    } else {
      let cashReq = await Cash.find().populate('userId');
      cashRequests = await Promise.all(
        cashReq.map(async (req) => {
          let reqUser = await User.findById(req.userId);

          if (reqUser.hr == userId || reqUser.manager == userId || reqUser.accountant == userId) {
            return req;
          } else {
            return null;
          }
        })
      );
      cashRequests = cashRequests.filter((req) => req !== null); // Remove null entries
    }

    // Convert createdAt and updatedAt dates to local string format
    cashRequests = cashRequests.map((cashRequest) => ({
      ...cashRequest.toObject(), // Convert Mongoose document to plain JavaScript object
      createdAt: new Date(cashRequest.createdAt).toDateString(),
      updatedAt: new Date(cashRequest.updatedAt).toDateString(),
     
        username: cashRequest.userId.username, // Add username to cash request object
    
    }));

    return NextResponse.json({ message: "success", data: cashRequests });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: error,
      message:
        "Something went wrong in the server while fetching cash requests",
    });
  }
};
