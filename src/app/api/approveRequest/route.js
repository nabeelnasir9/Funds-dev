import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/userModel";
import Cash from "../../../models/cashModel";
import Leave from "../../../models/leaveModel";
import PassOut from "../../../models/passoutModel";
import Invoice from "../../../models/invoiceModel";
import authMiddleware from "../../../utils/authMiddleware";
import { NextResponse } from "next/server";

// @ts-ignore
export const POST = async (request) => {
  try {
    await dbConnect();
    const { token, userRole, requestType, docId, status, approveUserData } =
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
      "status",
      approveUserData
    );
    // Authenticate user
    const userId = await authMiddleware(token);

    function calculateTimeDifference(startTime, endTime) {
      // Split the time strings into hours and minutes
      console.log(startTime, endTime, "startTime, endTime")
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      // Create Date objects with arbitrary dates but matching hours and minutes
      const startDate = new Date(0, 0, 0, startHour, startMinute);
      const endDate = new Date(0, 0, 0, endHour, endMinute);
      // Calculate the difference in milliseconds
      let diffInMs = endDate.getTime() - startDate.getTime();
      console.log(
        startTime,
        startDate,
        endDate,
        diffInMs,
        "+==================difff"
      );

      // Convert milliseconds to hours
      const diffInHours = diffInMs / (1000 * 60 * 60);

      return diffInHours;
    }

    let requester = await User.findById(userId);
    console.log(requester, "request role");
    if (requester.role === userRole && requester.role != "employee") {
      switch (requestType) {
        case "cash": {
          let cashDoc = await Cash.findById(docId);
          let applicationUser = await User.findById(cashDoc.userId);
          if (
            applicationUser.accountant === userId ||
            applicationUser.manager === userId ||
            applicationUser.md == userId
          ) {
            console.log(cashDoc, "doc found");
            if (userRole === "manager" || userRole === "md") {
              cashDoc.managerApprove = status;
              cashDoc.status = status;
              if (status === "reject") {
                cashDoc.status = status;
              }
            } else {
              cashDoc.accountantApprove = status;
              cashDoc.status = status;
            }
            let savedDoc = await cashDoc.save();
            return NextResponse.json({ message: "success", data: savedDoc });
          } else {
            return NextResponse.json({
              message: "auth error",
              data: "hr or manager id does not match",
            });
          }

          break;
        }
        case "invoices": {
          let InvoiceDoc = await Invoice.findById(docId);
          let applicationUser = await User.findById(InvoiceDoc.userId);
          if (
            applicationUser.accountant === userId ||
            applicationUser.manager === userId
          ) {
            console.log( "doc found", userRole, status);
            if (userRole === "manager") {
              InvoiceDoc.managerApprove = status;
              // if (status === "reject") {
                InvoiceDoc.status = status;
              // }
            } else {
              InvoiceDoc.accountantApprove = status;
              InvoiceDoc.status = status;
            }
            let savedDoc = await InvoiceDoc.save();
            console.log(savedDoc, "savedDoc")
            return NextResponse.json({ message: "success", data: savedDoc });
          } else {
            return NextResponse.json({
              message: "auth error",
              data: "hr or manager id does not match",
            });
          }

          break;
        }
        case "leaves": {
          let leaveDoc = await Leave.findById(docId);
          let applicationUser = await User.findById(leaveDoc.userId);
          if (
            applicationUser.hr === userId ||
            applicationUser.manager === userId ||
            applicationUser.md === userId
          ) {
            console.log(leaveDoc, "doc found");
            if (userRole === "manager" || userRole === "md") {
              leaveDoc.managerApprove = status;
              leaveDoc.status = status;
              let user = await User.findById(leaveDoc.userId);
                console.log("user saved", user, "--------------");
                if (leaveDoc.leaveType === "sick") {
                  user.leavesBalance.sick = user.leavesBalance.sick - leaveDoc?.numberOfDays;
                  console.log("user saved", user, "------after--------");

                  user.markModified("leavesBalance");
                  await user.save();
                } else {
                  user.leavesBalance.casual = user.leavesBalance.casual - leaveDoc?.numberOfDays;
                  console.log("user saved", user, "------after--------");
                  user.markModified("leavesBalance");
                  await user.save();
                }
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
                  user.leavesBalance.sick = user.leavesBalance.sick -leaveDoc?.numberOfDays;
                  console.log("user saved", user, "------after--------");

                  user.markModified("leavesBalance");
                  await user.save();
                } else {
                  user.leavesBalance.casual = user.leavesBalance.casual -leaveDoc?.numberOfDays;
                  console.log("user saved", user, "------after--------");
                  user.markModified("leavesBalance");
                  await user.save();
                }
              }
            }
            let savedDoc = await leaveDoc.save();
            return NextResponse.json({ message: "success", data: savedDoc });
          } else {
            return NextResponse.json({
              message: "auth error",
              data: "hr or manager id does not match",
            });
          }
          break;
        }

        case "passOut": {
          let passOutDoc = await PassOut.findById(docId);
          let applicationUser = await User.findById(passOutDoc.userId);
          if (
            applicationUser.hr === userId ||
            applicationUser.manager === userId || applicationUser.md === userId
          ) {
            console.log(passOutDoc, "doc found");
            console.log(userRole, "userRole")
            if (userRole === "manager" || userRole === "md") {
              passOutDoc.managerApprove = status;
              passOutDoc.status = status;
              if (status === "reject") {
                passOutDoc.status = status;
              }
            } else {
              passOutDoc.hrApprove = status;
              passOutDoc.status = status;
            }
            const diffInHours = calculateTimeDifference(
              passOutDoc?.timeFrom,
              passOutDoc?.timeTo,
            );
            console.log("diff in hous wla chala", diffInHours, "diffInHours");
            console.log(diffInHours, "diffInHours", applicationUser?.passOutBalance, "applicationUser?.passOutBalance", applicationUser?.leavesBalance.casual, "applicationUser?.leavesBalance.casual", diffInHours + applicationUser?.passOutBalance >= 8 && applicationUser?.leavesBalance.casual >= 1)

            if (diffInHours + applicationUser?.passOutBalance >= 8 && applicationUser?.leavesBalance.casual >= 1) {
              
              applicationUser.passOutBalance = Math.abs(applicationUser.passOutBalance - diffInHours);
              applicationUser.leavesBalance = {
                sick: applicationUser.leavesBalance.sick,
                casual: applicationUser.leavesBalance.casual - 1,
              };
              }
            
            else {
              applicationUser.passOutBalance = applicationUser.passOutBalance + diffInHours;
            }


            
            
            let saveUser = await applicationUser.save();
            let savedDoc = await passOutDoc.save();
            return NextResponse.json({ message: "success", data: savedDoc });
          } else {
            return NextResponse.json({
              message: "auth error",
              data: "hr or manager id does not match",
            });
          }
          break;
        }
        case "users": {
          let user = await User.findById(docId);
          if (status === "accept") {
            (user.role = approveUserData[0]),
              (user.hr = approveUserData[1]._id),
              (user.manager = approveUserData[2]._id);
              (user.accountant = approveUserData[3]._id);
          (user.md = approveUserData[4]._id);
            user.status = status;
            user.hrs = undefined;
            user.managers = undefined;
            user.accountants = undefined;
            user.mds = undefined;
          } else {
            user.status = status;
          }
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
