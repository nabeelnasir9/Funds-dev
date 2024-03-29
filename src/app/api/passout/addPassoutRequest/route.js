import dbConnect from "../../../../utils/dbConnect";
import Passout from "../../../../models/passoutModel";
import User from "../../../../models/userModel";
import authMiddleware from "../../../../utils/authMiddleware";
import { NextResponse } from "next/server";


export const POST = async (request) => {
  try {
    await dbConnect();
    const { reason, name, timeFrom, timeTo, token } = await request.json();
    let userId = await authMiddleware(token);

    // Calculate hours directly and push to passOutTotalHours array
    const hours = calculateHours(timeFrom, timeTo);
    const passOutTotalHours = [hours]; // Initialize passOutTotalHours array with calculated hours

    const totalHours = passOutTotalHours.reduce((acc, curr) => acc + curr, 0);
    let remainingCasualLeave = 0;
    if (totalHours >= 8) {
      remainingCasualLeave = totalHours - 8;
    }

    // Find the user
    const user = await User.findById(userId);

    // Update the casual leave balance
    if (user) {
      const updatedCasualLeaveBalance = user.leavesBalance.casual - remainingCasualLeave;

      // Update user's casual leave balance
      await User.findByIdAndUpdate(userId, { "leavesBalance.casual": updatedCasualLeaveBalance });

      const newPassout = new Passout({
        userId: userId,
        title: name,
        reason,
        timeFrom,
        timeTo,
        passOutTotalHours, // Directly assign passOutTotalHours array
      });

      const res = await newPassout.save();
      console.log(res, "request saved");

      return NextResponse.json({ message: "success", data: "res" });
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json({
      error: error,
      message: "Something went wrong in server while add cash request",
    });
  }
};


function calculateHours(timeFrom, timeTo) {
  const [hoursFrom, minutesFrom] = timeFrom.split(":").map(Number);
  const [hoursTo, minutesTo] = timeTo.split(":").map(Number);

  const fromDate = new Date(0, 0, 0, hoursFrom, minutesFrom);
  const toDate = new Date(0, 0, 0, hoursTo, minutesTo);

  const differenceMs = toDate - fromDate;
  const hoursDifference = differenceMs / (1000 * 60 * 60);

  return hoursDifference;
}
