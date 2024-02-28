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
    if (requester.role === userRole && requester.role != "employee") {
      switch (requestType) {
        case "cash": {
          let cashDoc = await Cash.findById(docId);
          console.log(cashDoc, "doc found");
          if (userRole === "manager") {
            cashDoc.mangerApprove = status;
            if (status === "reject") {
              cashDoc.status = status;
            }
          } else {
            cashDoc.hrApprove = status;
            cashDoc.status = status;
          }
          let savedDoc = await cashDoc.save();
          return NextResponse.json({ message: "success", data: savedDoc });

          break;
        }

        case "leaves": {
          let leaveDoc = await Leave.findById(docId);
          console.log(leaveDoc, "doc found");
          if (userRole === "manager") {
            leaveDoc.mangerApprove = status;
            if (status === "reject") {
              leaveDoc.status = status;
            }
          } else {
            leaveDoc.hrApprove = status;
            leaveDoc.status = status;
            if (status === "accept") {
              let user = await User.findById(leaveDoc.userId);
              console.log("user saved", user, "--------------");
              if (leaveDoc.leaveType === "sick") {
                user.leavesBalance.sick = user.leavesBalance.sick - 1;
                console.log("user saved", user, "------after--------");

                user.markModified("leavesBalance");
                await user.save();
              } else {
                user.leavesBalance.casual = user.leavesBalance.casual - 1;
                console.log("user saved", user, "------after--------");
                user.markModified("leavesBalance");
                await user.save();
              }
            }
          }
          let savedDoc = await leaveDoc.save();
          return NextResponse.json({ message: "success", data: savedDoc });

          break;
        }

        case "passOut": {
          let passOutDoc = await PassOut.findById(docId);
          console.log(passOutDoc, "doc found");
          if (userRole === "manager") {
            passOutDoc.mangerApprove = status;
            if (status === "reject") {
              passOutDoc.status = status;
            }
          } else {
            passOutDoc.hrApprove = status;
            passOutDoc.status = status;
          }
          let savedDoc = await passOutDoc.save();
          return NextResponse.json({ message: "success", data: savedDoc });

          break;
        }
        case "users": {
          let user = await User.findById(docId);
          console.log(user, "doc found");
          user.status = status;
          let savedDoc = await user.save();
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
