import dbConnect from "../../../../utils/dbConnect";
import Cash from "../../../../models/cashModel";
import authMiddleware from "../../../../utils/authMiddleware";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// @ts-ignore
export const POST = async (request) => {
  try {
    await dbConnect();
    const { token, docId ,reqNote} = await request.json();
    let userId = await authMiddleware(token);
    let cashDoc = await Cash.findById(docId);

    cashDoc.reqMore = "yes";
    cashDoc.reqNote=reqNote;

    let savedDoc = await cashDoc.save();
    return NextResponse.json({ message: "success", data: savedDoc });
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json({
      error: error,
      message: "Something went wrong in server while add cash request",
    });
  }
};
