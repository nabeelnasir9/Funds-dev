import * as z from 'zod'

import { ExtendedForm } from '@/lib/interfaces'
import { CreateUser, User } from './interfaces'
import { NO_VALUE } from '@/lib/config'

export const createCashRequestForm: ExtendedForm<CreateUser> = [
	{
		type: 'normal-group',
		fields: [
			{
				label: 'Title',
				key: 'title',
				type: 'textarea',
				valueType: 'normal',
				defaultValue: '',
				placeholder: '',
				validation: z.string().min(1, 'Title is required'),
			},
			{
				label: 'Amount (SAR)',
				key: 'amount',
				type: 'number',
				valueType: 'normal',
				defaultValue: "0",
				placeholder: '',
				validation: z.string().transform((a) => Number(a)),
			},
			// {
			// 	label: 'Type',
			// 	key: 'type',
			// 	type: 'select',
			// 	valueType: 'normal',
			// 	values: [
			// 		{
			// 			label: '--------Select------',
			// 			value: NO_VALUE,
			// 		},
			// 		{
			// 			label: 'Advance',
			// 			value: 'advance',
			// 		},
			// 		{
			// 			label: 'Paid',
			// 			value: 'paid',
			// 		},
			// 	],
			// 	defaultValue: '',
			// 	placeholder: 'Select Role',
			// 	validation: z.enum(['advance', 'paid']),
			// },
			{
				label: "Attachment",
				key: "attachment",
				type: "file",
				valueType: "normal",
				defaultValue: "",
				placeholder: "",
				validation: z.string().min(0),
			  },
		],
	},
]

// export const searchUserForm: ExtendedForm<User> = [
// 	{
// 		type: 'normal-group',
// 		fields: [
// 			{
// 				label: 'Email',
// 				key: 'email',
// 				type: 'text',
// 				valueType: 'normal',
// 				defaultValue: '',
// 				placeholder: '',
// 				validation: z.any(),
// 			},
// 			{
// 				label: 'Username',
// 				key: 'user_name',
// 				type: 'text',
// 				valueType: 'normal',
// 				defaultValue: '',
// 				placeholder: '',
// 				validation: z.any(),
// 			},
// 			{
// 				label: 'Role',
// 				key: 'role',
// 				type: 'select',
// 				valueType: 'normal',
// 				values: [
// 					{
// 						label: '--Select--',
// 						value: NO_VALUE,
// 					},
// 					{
// 						label: 'User',
// 						value: 'user',
// 					},
// 					{
// 						label: 'Admin',
// 						value: 'admin',
// 					},
// 				],
// 				defaultValue: '',
// 				placeholder: 'Select Role',
// 				validation: z.any(),
// 			},
// 			{
// 				label: 'Access Level',
// 				key: 'access_level',
// 				type: 'select',
// 				valueType: 'normal',
// 				values: [
// 					{
// 						label: '--Select--',
// 						value: NO_VALUE,
// 					},
// 					{
// 						label: 'Read Access',
// 						value: 'read',
// 					},
// 					{
// 						label: 'Create & Read Access',
// 						value: 'create,read',
// 					},
// 					{
// 						label: 'Create, Read & Update Access',
// 						value: 'create,read,update',
// 					},
// 					{
// 						label: 'Create, Read, Update & Delete Access',
// 						value: 'create,read,update,delete',
// 					},
// 				],
// 				defaultValue: '',
// 				placeholder: 'Select Access Level',
// 				validation: z.any(),
// 			},
// 			{
// 				label: 'Is Banned',
// 				key: 'isBanned',
// 				type: 'select',
// 				valueType: 'normal',
// 				values: [
// 					{
// 						label: '--Select--',
// 						value: NO_VALUE,
// 					},
// 					{
// 						label: 'Yes',
// 						value: 'true',
// 					},
// 					{
// 						label: 'No',
// 						value: 'false',
// 					},
// 				],
// 				defaultValue: '',
// 				placeholder: 'Change Ban Status',
// 				validation: z.any(),
// 			},
// 			{
// 				label: 'Is Creator',
// 				key: 'isCreator',
// 				type: 'select',
// 				valueType: 'normal',
// 				values: [
// 					{
// 						label: '--Select--',
// 						value: NO_VALUE,
// 					},
// 					{
// 						label: 'Yes',
// 						value: 'true',
// 					},
// 					{
// 						label: 'No',
// 						value: 'false',
// 					},
// 				],
// 				defaultValue: '',
// 				placeholder: 'Change Creator Status',
// 				validation: z.any(),
// 			},
// 			{
// 				label: 'Is Verified',
// 				key: 'isVerified',
// 				type: 'select',
// 				valueType: 'normal',
// 				values: [
// 					{
// 						label: '--Select--',
// 						value: NO_VALUE,
// 					},
// 					{
// 						label: 'Yes',
// 						value: 'true',
// 					},
// 					{
// 						label: 'No',
// 						value: 'false',
// 					},
// 				],
// 				defaultValue: '',
// 				placeholder: 'Change Verified Status',
// 				validation: z.any(),
// 			},
// 		],
// 	},
// ]

// export const updateUserForm: ExtendedForm<CreateUser> = [
// 	{
// 		type: 'normal-group',
// 		fields: [
// 			{
// 				label: 'Email',
// 				key: 'email',
// 				type: 'text',
// 				valueType: 'normal',
// 				defaultValue: '',
// 				placeholder: '',
// 				validation: z
// 					.string()
// 					.min(1, 'Email is required')
// 					.email('Invalid email')
// 					.optional(),
// 			},
// 			{
// 				label: 'Username',
// 				key: 'user_name',
// 				type: 'text',
// 				valueType: 'normal',
// 				defaultValue: '',
// 				placeholder: '',
// 				validation: z.string().min(1, 'Username is required').optional(),
// 			},
// 			{
// 				label: 'Name',
// 				key: 'name',
// 				type: 'text',
// 				valueType: 'normal',
// 				defaultValue: '',
// 				placeholder: '',
// 				validation: z.string().optional(),
// 			},
// 			{
// 				label: 'Phone',
// 				key: 'phone',
// 				type: 'number',
// 				valueType: 'normal',
// 				defaultValue: '',
// 				placeholder: '',
// 				validation: z
// 					.string()
// 					.transform((a) => Number(a))
// 					.optional(),
// 			},
// 			{
// 				label: 'Role',
// 				key: 'role',
// 				type: 'select',
// 				valueType: 'normal',
// 				values: [
// 					{
// 						label: 'User',
// 						value: 'user',
// 					},
// 					{
// 						label: 'Admin',
// 						value: 'admin',
// 					},
// 				],
// 				defaultValue: '',
// 				placeholder: 'Select Role',
// 				validation: z.enum(['user', 'admin']).optional(),
// 			},
// 			{
// 				label: 'Access Level',
// 				key: 'access_level',
// 				type: 'select',
// 				valueType: 'normal',
// 				values: [
// 					{
// 						label: 'Read Access',
// 						value: 'read',
// 					},
// 					{
// 						label: 'Create & Read Access',
// 						value: 'create,read',
// 					},
// 					{
// 						label: 'Create, Read & Update Access',
// 						value: 'create,read,update',
// 					},
// 					{
// 						label: 'Create, Read, Update & Delete Access',
// 						value: 'create,read,update,delete',
// 					},
// 				],
// 				defaultValue: '',
// 				placeholder: 'Select Access Level',
// 				validation: z
// 					.enum([
// 						'read',
// 						'create,read',
// 						'create,read,update',
// 						'create,read,update,delete',
// 					])
// 					.optional(),
// 			},
// 			{
// 				label: 'Is Banned',
// 				key: 'isBanned',
// 				type: 'select',
// 				valueType: 'normal',
// 				values: [
// 					{
// 						label: 'Yes',
// 						value: 'true',
// 					},
// 					{
// 						label: 'No',
// 						value: 'false',
// 					},
// 				],
// 				defaultValue: '',
// 				placeholder: 'Change Ban Status',
// 				validation: z
// 					.enum(['true', 'false'])
// 					.transform((a) => (a === 'true' ? true : false))
// 					.optional(),
// 			},
// 			{
// 				label: 'Is Creator',
// 				key: 'isCreator',
// 				type: 'select',
// 				valueType: 'normal',
// 				values: [
// 					{
// 						label: 'Yes',
// 						value: 'true',
// 					},
// 					{
// 						label: 'No',
// 						value: 'false',
// 					},
// 				],
// 				defaultValue: '',
// 				placeholder: 'Change Creator Status',
// 				validation: z
// 					.enum(['true', 'false'])
// 					.transform((a) => (a === 'true' ? true : false))
// 					.optional(),
// 			},
// 			{
// 				label: 'Is Verified',
// 				key: 'isVerified',
// 				type: 'select',
// 				valueType: 'normal',
// 				values: [
// 					{
// 						label: 'Yes',
// 						value: 'true',
// 					},
// 					{
// 						label: 'No',
// 						value: 'false',
// 					},
// 				],
// 				defaultValue: '',
// 				placeholder: 'Change Verified Status',
// 				validation: z
// 					.enum(['true', 'false'])
// 					.transform((a) => (a === 'true' ? true : false))
// 					.optional(),
// 			},
// 			{
// 				label: 'Password',
// 				key: 'password',
// 				type: 'text',
// 				valueType: 'normal',
// 				defaultValue: '',
// 				placeholder: '',
// 				validation: z
// 					.string()
// 					.min(1, 'Password is required')
// 					.min(8, 'Password must have than 8 characters')
// 					.optional(),
// 			},
// 		],
// 	},
// ]
