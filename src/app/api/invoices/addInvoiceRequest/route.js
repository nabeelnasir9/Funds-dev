import dbConnect from "../../../../utils/dbConnect";
import Invoice from "../../../../models/invoiceModel";
import authMiddleware from "../../../../utils/authMiddleware";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// @ts-ignore
export const POST = async (request) => {
  try {
    await dbConnect();
    const {  name,invoiceNo,dateOfInvoice,invoiceDescription,totalAmount,totalAmountExclVAT,expense,netEarning,percentage,  token,attachment } = await request.json();
    console.log("🚀 ~ POST ~ dateOfInvoice:", dateOfInvoice)
    console.log(token, "====================", name);
    // const authorization = headers().get("Authorization");
    // console.log(authorization)
    let userId = await authMiddleware(token);

    const newInvoice = new Invoice({
      userId: userId,
      title: name,
      invoiceNo: invoiceNo,
      dateOfInvoice: dateOfInvoice,
      invoiceDescription: invoiceDescription,
      totalAmount: totalAmount,
      totalAmountExclVAT: totalAmountExclVAT,
      expense: expense,
      netEarning: netEarning,
      percentage: percentage,
      attachment: attachment
    });

    const res = await newInvoice.save();
    console.log(res, "request saved");

    return NextResponse.json({ message: "success", data: "res" });
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json({
      error: error,
      message: "Something went wrong in server while add cash request",
    });
  }
};
