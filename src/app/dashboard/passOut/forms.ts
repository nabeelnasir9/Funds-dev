import * as z from "zod";
import { ExtendedForm } from "@/lib/interfaces";
import { CreateUser, User } from "./interfaces";
import { NO_VALUE } from "@/lib/config";

export const createUserForm: ExtendedForm<CreateUser> = [
  {
    type: "normal-group",
    fields: [
      {
        label: "Name",
        key: "name",
        type: "text",
        valueType: "normal",
        defaultValue: "",
        placeholder: "",
        validation: z.string().min(1, "name is required"),
      },
      {
        label: "PassOut",
        key: "passOut",
        type: "select",
        valueType: "normal",
        values: generatePassOutOptions(),
        defaultValue: "",
        placeholder: "Select time",
        validation: z.string().min(1, "time is required"),
      },
      {
        label: "Reason",
        key: "reason",
        type: "text",
        valueType: "normal",
        defaultValue: "",
        placeholder: "",
        validation: z.string().min(1, "reason is required"),
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
