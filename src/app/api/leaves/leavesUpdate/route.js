import dbConnect from "../../../../utils/dbConnect";
import User from "../../../../models/userModel";
import { NextResponse } from "next/server";
// @ts-ignore
export const POST = async () => {
  try {
    await dbConnect();
    
    const users = await User.find();
    console.log(users, "==================users=========");

    // update every user leaves add 2.5
    users.map(async (user) => {
        let sickLeaves = user?.leavesBalance?.sick;
        let casualLeaves = user?.leavesBalance?.casual;
        if (sickLeaves){
            sickLeaves = sickLeaves + 2.5;
        }
        if (casualLeaves){
            casualLeaves = casualLeaves + 2.5;
        }
        await User.findByIdAndUpdate(user._id, {
            leavesBalance: {
                sick: sickLeaves,
                casual: casualLeaves
            }
        });
    }
    );


    return NextResponse.json({ message: "success", data: "res" });
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json({
      error: error,
      message: "Something went wrong in server while add cash request",
    });
  }
};
