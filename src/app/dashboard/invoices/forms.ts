import * as z from "zod";
import { ExtendedForm } from "@/lib/interfaces";
import { CreateUser, User } from "./interfaces";
import { NO_VALUE } from "@/lib/config";
export const createUserForm: ExtendedForm<CreateUser> = [
  {
    type: "normal-group",
    fields: [
      {
        label: "Title",
        key: "name",
        type: "text",
        valueType: "normal",
        defaultValue: "",
        placeholder: "",
        validation: z.string().min(1, "name is required"),
      },
      {
        label: "Attachment",
        key: "attachment",
        type: "file",
        valueType: "normal",
        defaultValue: "",
        placeholder: "",
        validation: z.string().min(0),
      },
      {
        label: "Invoice to Company",
        key: "invoiceToCompany",
        type: "select",
        valueType: "normal",
        values: [
          {
            label: "--------Select------",
            value: NO_VALUE,
          },
          {
            label: "Anaf",
            value: "anaf",
          },
          {
            label: "Elite",
            value: "elite",
          },
        ],
        defaultValue: "",
        placeholder: "",
        validation: z.string().min(1, "Invoice to Company is required"),
      },
      {
        label: "Invoice No.",
        key: "invoiceNo",
        type: "text",
        valueType: "normal",
        defaultValue: "",
        placeholder: "",
        validation: z.string().min(1, "Invoice No. is required"),
      },
      {
        label: "Date of Invoice",
        key: "dateOfInvoice",
        type: "date",
        valueType: "normal",
        defaultValue: "",
        placeholder: "",
        validation: z.string().min(1, "Date of Invoice is required"),
      },
      {
        label: "Invoice Description",
        key: "invoiceDescription",
        type: "text",
        valueType: "normal",
        defaultValue: "",
        placeholder: "",
        validation: z.string().min(1, "Invoice Description is required"),
      },
      {
        label: "Total Amount",
        key: "totalAmount",
        type: "number",
        valueType: "normal",
        defaultValue: "",
        placeholder: "",
        validation: z.string().min(1, "Total Amount is required"),
      },
      {
        label: "Total Amount excl. VAT",
        key: "totalAmountExclVAT",
        type: "number",
        valueType: "normal",
        defaultValue: "",
        placeholder: "",
        validation: z.string().min(1, "Total Amount excl. VAT is required"),
      },
      {
        label: "Expense",
        key: "expense",
        type: "number",
        valueType: "normal",
        defaultValue: "",
        placeholder: "",
        validation: z.string().min(1, "Expense is required"),
      },
      {
        label: "Net Earning",
        key: "netEarning",
        type: "number",
        valueType: "normal",
        defaultValue: "",
        placeholder: "",
        validation: z.string().min(1, "Net Earning is required"),
      },
      {
        label: "Percentage",
        key: "percentage",
        type: "number",
        valueType: "normal",
        defaultValue: "",
        placeholder: "",
        validation: z.string().min(1, "Percentage is required"),
      },
    ],
  },
];


// Function to generate passOut options from 8 AM to 4 PM with a half-hour gap
function generatePassOutOptions() {
  const options = [{ label: "--------Select------", value: NO_VALUE }];
  const startTime = 8; // 8 AM
  const endTime = 16; // 4 PM
  for (let hour = startTime; hour <= endTime; hour++) {
    for (let minute = 0; minute <= 30; minute += 30) {
      const timeString =
        (hour < 10 ? "0" : "") +
        hour +
        ":" +
        (minute === 0 ? "00" : minute);
      options.push({
        label: timeString,
        value: timeString,
      });
    }
  }
  return options;
}
