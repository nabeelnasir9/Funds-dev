import { HttpCommonResponse, CommonGetAllResponse } from '@/lib/interfaces'

export class UserClass {
	constructor(
		public _id: string = '',
		public title: string = '',
		public amount: number = 0,
		public type:"Select type" | "advance" | "paid" = "Select type" ,
		public createdAt: string = '',
		public updatedAt: string = '',
		public hrApprove: string = '',
		public mangerApprove: string = '',
		public status: string = '',
		// public email: string = '',
		// public user_name: string = '',
		// public role: string = '',
		// public access_level: string = '',
		// public isBanned: boolean = true,
		// public isCreator: boolean = true,
		// public isVerified: boolean = true,

		// public user_name: string = '',
		// public email: string = '',
	
		// public phone: string = '',
		// public current_balance: number = 123,
		// public isBanned: boolean = true,
		// public isCreator: boolean = true,
		// public isVerified: boolean = true,
		// public access_level:
		// 	| 'read'
		// 	| 'create,read'
		// 	| 'create,read,update'
		// 	| 'create,read,update,delete' = 'read',
		// public role: 'user' | 'admin' = 'user',
		// public transactionIds: string[] = [],
	) {}
}

export interface User extends UserClass {}

export interface CreateUser extends Omit<User, '_id'> {
	password: string
	name?: string
	phone?: string
}

export interface TableUser extends Omit<User, 'transactionIds' | 'updated_at' | '_id'> {}

export interface GetUserResponse extends HttpCommonResponse {
	user: User
}

export interface GetUsersResponse extends CommonGetAllResponse {
	users: User[]
}
