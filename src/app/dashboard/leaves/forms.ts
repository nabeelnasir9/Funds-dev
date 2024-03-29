import * as z from "zod";

import { ExtendedForm } from "@/lib/interfaces";
import { CreateUser, User } from "./interfaces";
import { NO_VALUE } from "@/lib/config";

function validateAttachment(value: any, formValues: any) {
  console.log(value,"------------------values from the attat-----------------");
  console.log(formValues,"------------------values from the formValues-----------------");

  if (formValues.leave === "sick" && !value) {
      return "Attachment is required for sick leave";
  }
  return undefined;
}

// Define your Zod schema
export const createUserLeaveFormSchema = z.object({
  name: z.string().min(1, 'name is required'),
  leave: z.enum(["sick", "casual"]),
  reasons: z.string().min(1, 'reason is required'),
  date_from: z.string().min(1, 'Date From is required'), // Add date_from key
  date_to: z.string().min(1, 'Date To is required'), // Add date_to key
  number_of_days: z.number().min(1, 'Number of Days is required'), // Add number_of_days key
  // date: z.string().min(1, 'Date is required'),
  attachment: z.custom((value) => {
    console.log(value,"------------------values from the attat-----------------");
    
    return (formValues: any) => {
    console.log(formValues,"------------------values from the formValues-----------------");

        // if (formValues.leave === "sick" && !value) {
            return "Attachment is required for sick leave";
        // }
        return undefined;
    };
})
});

// Define your form using the ExtendedForm type
export const createUserLeaveForm: ExtendedForm<z.infer<typeof createUserLeaveFormSchema>> = [
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
        validation: createUserLeaveFormSchema.shape.name,
      },

      {
        label: "Leave",
        key: "leave",
        type: "select",
        valueType: "normal",
        values: [
          {
            label: "--------Select------",
            value: NO_VALUE,
          },
          {
            label: "Casual",
            value: "casual",
          },
          {
            label: "Sick",
            value: "sick",
          },
        ],
        defaultValue: "",
        placeholder: "Select Role",
        validation: createUserLeaveFormSchema.shape.leave,
      },

      {
        label: "Reason",
        key: "reasons",
        type: "textarea",
        valueType: "normal",
        defaultValue: "",
        placeholder: "",
        validation: createUserLeaveFormSchema.shape.reasons,
      },
      {
				label: 'Date From',
				key: 'date_from',
				type: 'date',
				valueType: 'normal',
				defaultValue: '',
				placeholder: '',
				validation: z.string().min(1, `Check In Date is required`),
			},
			{
				label: 'Date To',
				key: 'date_to',
				type: 'date',
				valueType: 'normal',
				defaultValue: '',
				placeholder: '',
				validation: z.string().min(1, `Checkout Date is required`),
			},
			{
				label: 'Number Of Days',
				key: 'number_of_days',
				type: 'number',
				valueType: 'derived',
				expression:
					'=== return = Math.floor((new Date(date_to) - new Date(date_from)) / (24 * 60 * 60 * 1000))',
				derivationType: 'arithmetic',
				defaultValue: '',
				placeholder: '',
				validation: z
					.string()
					.min(1, `Number Of Days is required`)
					.transform((a) => Number(a)),
				disabled: true,
			},

      {
        label: "Attachment",
        key: "attachment",
        type: "file",
        valueType: "normal",
        defaultValue: "",
        placeholder: "",
        validation: createUserLeaveFormSchema.shape.attachment,
      },
    ],
  },
];


// export const searchUserForm: ExtendedForm<User> = [
//   {
//     type: "normal-group",
//     fields: [
//       {
//         label: "Email",
//         key: "email",
//         type: "text",
//         valueType: "normal",
//         defaultValue: "",
//         placeholder: "",
//         validation: z.any(),
//       },
//       {
//         label: "Username",
//         key: "user_name",
//         type: "text",
//         valueType: "normal",
//         defaultValue: "",
//         placeholder: "",
//         validation: z.any(),
//       },
//       {
//         label: "Role",
//         key: "role",
//         type: "select",
//         valueType: "normal",
//         values: [
//           {
//             label: "--Select--",
//             value: NO_VALUE,
//           },
//           {
//             label: "User",
//             value: "user",
//           },
//           {
//             label: "Admin",
//             value: "admin",
//           },
//         ],
//         defaultValue: "",
//         placeholder: "Select Role",
//         validation: z.any(),
//       },
//       {
//         label: "Access Level",
//         key: "access_level",
//         type: "select",
//         valueType: "normal",
//         values: [
//           {
//             label: "--Select--",
//             value: NO_VALUE,
//           },
//           {
//             label: "Read Access",
//             value: "read",
//           },
//           {
//             label: "Create & Read Access",
//             value: "create,read",
//           },
//           {
//             label: "Create, Read & Update Access",
//             value: "create,read,update",
//           },
//           {
//             label: "Create, Read, Update & Delete Access",
//             value: "create,read,update,delete",
//           },
//         ],
//         defaultValue: "",
//         placeholder: "Select Access Level",
//         validation: z.any(),
//       },
//       {
//         label: "Is Banned",
//         key: "isBanned",
//         type: "select",
//         valueType: "normal",
//         values: [
//           {
//             label: "--Select--",
//             value: NO_VALUE,
//           },
//           {
//             label: "Yes",
//             value: "true",
//           },
//           {
//             label: "No",
//             value: "false",
//           },
//         ],
//         defaultValue: "",
//         placeholder: "Change Ban Status",
//         validation: z.any(),
//       },
//       {
//         label: "Is Creator",
//         key: "isCreator",
//         type: "select",
//         valueType: "normal",
//         values: [
//           {
//             label: "--Select--",
//             value: NO_VALUE,
//           },
//           {
//             label: "Yes",
//             value: "true",
//           },
//           {
//             label: "No",
//             value: "false",
//           },
//         ],
//         defaultValue: "",
//         placeholder: "Change Creator Status",
//         validation: z.any(),
//       },
//       {
//         label: "Is Verified",
//         key: "isVerified",
//         type: "select",
//         valueType: "normal",
//         values: [
//           {
//             label: "--Select--",
//             value: NO_VALUE,
//           },
//           {
//             label: "Yes",
//             value: "true",
//           },
//           {
//             label: "No",
//             value: "false",
//           },
//         ],
//         defaultValue: "",
//         placeholder: "Change Verified Status",
//         validation: z.any(),
//       },
//     ],
//   },
// ];

// export const updateUserForm: ExtendedForm<CreateUser> = [
//   {
//     type: "normal-group",
//     fields: [
//       {
//         label: "Email",
//         key: "email",
//         type: "text",
//         valueType: "normal",
//         defaultValue: "",
//         placeholder: "",
//         validation: z
//           .string()
//           .min(1, "Email is required")
//           .email("Invalid email")
//           .optional(),
//       },
//       {
//         label: "Username",
//         key: "user_name",
//         type: "text",
//         valueType: "normal",
//         defaultValue: "",
//         placeholder: "",
//         validation: z.string().min(1, "Username is required").optional(),
//       },
//       {
//         label: "Name",
//         key: "name",
//         type: "text",
//         valueType: "normal",
//         defaultValue: "",
//         placeholder: "",
//         validation: z.string().optional(),
//       },
//       {
//         label: "Phone",
//         key: "phone",
//         type: "number",
//         valueType: "normal",
//         defaultValue: "",
//         placeholder: "",
//         validation: z
//           .string()
//           .transform((a) => Number(a))
//           .optional(),
//       },
//       {
//         label: "Role",
//         key: "role",
//         type: "select",
//         valueType: "normal",
//         values: [
//           {
//             label: "User",
//             value: "user",
//           },
//           {
//             label: "Admin",
//             value: "admin",
//           },
//         ],
//         defaultValue: "",
//         placeholder: "Select Role",
//         validation: z.enum(["user", "admin"]).optional(),
//       },
//       {
//         label: "Access Level",
//         key: "access_level",
//         type: "select",
//         valueType: "normal",
//         values: [
//           {
//             label: "Read Access",
//             value: "read",
//           },
//           {
//             label: "Create & Read Access",
//             value: "create,read",
//           },
//           {
//             label: "Create, Read & Update Access",
//             value: "create,read,update",
//           },
//           {
//             label: "Create, Read, Update & Delete Access",
//             value: "create,read,update,delete",
//           },
//         ],
//         defaultValue: "",
//         placeholder: "Select Access Level",
//         validation: z
//           .enum([
//             "read",
//             "create,read",
//             "create,read,update",
//             "create,read,update,delete",
//           ])
//           .optional(),
//       },
//       {
//         label: "Is Banned",
//         key: "isBanned",
//         type: "select",
//         valueType: "normal",
//         values: [
//           {
//             label: "Yes",
//             value: "true",
//           },
//           {
//             label: "No",
//             value: "false",
//           },
//         ],
//         defaultValue: "",
//         placeholder: "Change Ban Status",
//         validation: z
//           .enum(["true", "false"])
//           .transform((a) => (a === "true" ? true : false))
//           .optional(),
//       },
//       {
//         label: "Is Creator",
//         key: "isCreator",
//         type: "select",
//         valueType: "normal",
//         values: [
//           {
//             label: "Yes",
//             value: "true",
//           },
//           {
//             label: "No",
//             value: "false",
//           },
//         ],
//         defaultValue: "",
//         placeholder: "Change Creator Status",
//         validation: z
//           .enum(["true", "false"])
//           .transform((a) => (a === "true" ? true : false))
//           .optional(),
//       },
//       {
//         label: "Is Verified",
//         key: "isVerified",
//         type: "select",
//         valueType: "normal",
//         values: [
//           {
//             label: "Yes",
//             value: "true",
//           },
//           {
//             label: "No",
//             value: "false",
//           },
//         ],
//         defaultValue: "",
//         placeholder: "Change Verified Status",
//         validation: z
//           .enum(["true", "false"])
//           .transform((a) => (a === "true" ? true : false))
//           .optional(),
//       },
//       {
//         label: "Password",
//         key: "password",
//         type: "text",
//         valueType: "normal",
//         defaultValue: "",
//         placeholder: "",
//         validation: z
//           .string()
//           .min(1, "Password is required")
//           .min(8, "Password must have than 8 characters")
//           .optional(),
//       },
//     ],
//   },
// ];
