import dbConnect from "../../../../utils/dbConnect";
import Passout from "../../../../models/passoutModel";
import authMiddleware from "../../../../utils/authMiddleware";
import User from "../../../../models/userModel"; // Import User model if used

import { NextResponse } from "next/server";

// @ts-ignore
export const POST = async (request) => {
  try {
    await dbConnect();
    const { token,employee } = await request.json();

    console.log(token, "==================token=========");
    // Authenticate user
    const userId = await authMiddleware(token);

    // Fetch cash requests for the authenticated user
    let passoutRequests ;

    if (employee) {
      passoutRequests = await Passout.find({userId:userId});
   } else {

    let passoutReq = await Passout.find(); // Declare leavesReq
    passoutRequests = await Promise.all(
      passoutReq.map(async (req) => {
        let reqUser = await User.findById(req.userId); // Assuming User model is imported

        if (reqUser.hr == userId || reqUser.manager == userId) {
          return req;
        } else {
          return null;
        }
      })
    );
    passoutRequests = passoutRequests.filter((req) => req !== null); // Remove null entries
   }
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
