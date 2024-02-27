import dbConnect from "../../../../utils/dbConnect";
import Cash from "../../../../models/cashModel";
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
    let cashRequests = await Cash.find();

    // Convert createdAt and updatedAt dates to local string format
    cashRequests = cashRequests.map(cashRequest => ({
      ...cashRequest.toObject(), // Convert Mongoose document to plain JavaScript object
      createdAt: new Date(cashRequest.createdAt).toDateString(),
      updatedAt: new Date(cashRequest.updatedAt).toDateString(),
    }));

    return NextResponse.json({ message: "success", data: cashRequests });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: error,
      message: "Something went wrong in the server while fetching cash requests",
    });
  }
};
