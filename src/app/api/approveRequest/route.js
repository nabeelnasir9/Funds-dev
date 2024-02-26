import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/userModel";
import Cash from "../../../models/cashModel";
import Leave from "../../../models/leaveModel";
import PassOut from "../../../models/passoutModel";
import authMiddleware from "../../../utils/authMiddleware";
import { NextResponse } from "next/server";

// @ts-ignore
export const POST = async (request) => {
  try {
    await dbConnect();
    const { token, userRole, requestType, docId, status } =
      await request.json();

    console.log(
      token,
      "==================token=========",
      userRole,
      "docId",
      requestType,
      "docId",
      docId,
      "requestType",
      status,
      "status"
    );
    // Authenticate user
    const userId = await authMiddleware(token);

    let requester = await User.findById(userId);
    console.log(requester, "request role");
    if (requester.role === userRole && requester.role !="employee") {
      switch (requestType) {
        case "cash": {
          let cashDoc = await Cash.findById(docId);
          console.log(cashDoc, "doc found");
          if (userRole === "manager") {
            cashDoc.mangerApprove = { status: status, checked: true };
          } else {
            cashDoc.hrApprove = { status: status, checked: true };
          }
          let savedDoc = await cashDoc.save();
          return NextResponse.json({ message: "success", data: savedDoc });

          break;
        }

        case "leaves": {
          let leaveDoc = await Leave.findById(docId);
          console.log(leaveDoc, "doc found");
          if (userRole === "manager") {
            leaveDoc.mangerApprove = { status: status, checked: true };
          } else {
            leaveDoc.hrApprove = { status: status, checked: true };
          }
          let savedDoc = await leaveDoc.save();
          return NextResponse.json({ message: "success", data: savedDoc });

          break;
        }

        case "passOut": {
          let passOutDoc = await PassOut.findById(docId);
          console.log(passOutDoc, "doc found");
          if (userRole === "manager") {
            passOutDoc.mangerApprove = { status: status, checked: true };
          } else {
            passOutDoc.hrApprove = { status: status, checked: true };
          }
          let savedDoc = await passOutDoc.save();
          return NextResponse.json({ message: "success", data: savedDoc });

          break;
        }
        default:
          return NextResponse.json({
            message: "your are employee",
            data: "your are employee",
          });

          break;
      }
      //   return NextResponse.json({ message: "success", data: cashRequests });
    } else {
      return NextResponse.json({
        message: "invalid admin credentials",
        data: "nothing",
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: error,
      message:
        "Something went wrong in the server while fetching cash requests",
    });
  }
};
