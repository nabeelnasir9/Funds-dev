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
        type: "textarea",
        valueType: "normal",
        defaultValue: "",
        placeholder: "",
        validation: z.string().min(1, "name is required"),
      },
      // {
      //   label: "PassOut",
      //   key: "passOut",
      //   type: "select",
      //   valueType: "normal",
      //   values: generatePassOutOptions(),
      //   defaultValue: "",
      //   placeholder: "Select time",
      //   validation: z.string().min(1, "time is required"),
      // },
      {
        label: "Time From",
        key: "timeFrom",
        type: "select",
        valueType: "normal",
        values: generatePassOutOptions(), // You need to define generatePassOutOptions function
        defaultValue: "",
        placeholder: "Select start time",
        validation: z.string().min(1, "Time From is required"),
      },
      {
        label: "Time To",
        key: "timeTo",
        type: "select",
        valueType: "normal",
        values: generatePassOutOptions(), // You need to define generatePassOutOptions function
        defaultValue: "",
        placeholder: "Select end time",
        validation: z.string().min(1, "Time To is required"),
      },
    //   {
    //     label: 'Number Of Minutes',
    //     key: 'number_of_minutes',
    //     type: 'number',
    //     valueType: 'derived',
    //     expression:
    //     '=== Math.floor((timeTo - timeFrom) / (1000 * 60))',
    //     derivationType: 'arithmetic',
    //     defaultValue: '',
    //     placeholder: '',
    //     validation: z
    //         .string()
    //         .min(1, `Number Of Minutes is required`)
    //         .transform((a) => Number(a)),
    //     disabled: true,
    // },
      {
        label: "Reason",
        key: "reason",
        type: "textarea",
        valueType: "normal",
        defaultValue: "",
        placeholder: "",
        validation: z.string().min(1, "Reason is required"),
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
  console.log(options)
  return options;
}
