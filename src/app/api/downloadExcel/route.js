import dbConnect from "../../../utils/dbConnect";
import Invoice from "../../../models/invoiceModel";
import Cash from "../../../models/cashModel";
import Leaves from "../../../models/leaveModel";
import Passout from "../../../models/passoutModel";
import authMiddleware from "../../../utils/authMiddleware";
import User from "../../../models/userModel"; // Import User model if used

import { NextResponse } from "next/server";
import XLSX from "xlsx";

// @ts-ignore
export const POST = async (request) => {
  try {
    const jsonData = [
      { name: 'John', email: 'john@example.com', age: 30 },
      { name: 'Jane', email: 'jane@example.com', age: 25 },
    ];
  
    // Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
    // Generate buffer
    const buffer = XLSX.write.xlsx(workbook, { bookType: 'xlsx', type: 'buffer' });
  
    // Set headers to respond with a downloadable file
    // Assuming `res` is passed as an argument
    res.setHeader('Content-Disposition', 'attachment; filename="data.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  
    // Send the buffer as a response
    // Assuming `res` is passed as an argument
    res.send(buffer);

    // Return both the Excel buffer and the JSON data
    return new NextResponse({
      body: {
        excelBuffer: buffer.toString('base64'), // Convert buffer to base64 string
        jsonData: { message: "success", data: passoutRequests } // Assuming `passoutRequests` is defined
      }
    });
  } catch (error) {
    console.error(error);
    return new NextResponse({
      json: {
        error: error,
        message: "Something went wrong in the server while fetching xlsx requests",
      }
    });
  }
};
