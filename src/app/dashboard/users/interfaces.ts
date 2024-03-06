import { HttpCommonResponse, CommonGetAllResponse } from "@/lib/interfaces";

export class UserClass {
  constructor(
    public _id: string = "",
    // public user_name: string = '',
    public username: string = "",
    public email: string = "",
    public createdAt: string = "",

    public status: string = "",
    public role: string = "",
    public roles:any=["employee","hr","manager"],
    public hrs:any =[],
    public managers: any=[] ,
    public accountants: any=[] // public phone: string = '',
  ) // public date: string = '',
  // public time: string = '',
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
  // public updated_at: string = '',
  {}
}

export interface User extends UserClass {}

export interface CreateUser extends Omit<User, "_id"> {
  password: string;
}

export interface TableUser
  extends Omit<User, "transactionIds" | "updated_at" | "_id"> {}

export interface GetUserResponse extends HttpCommonResponse {
  user: User;
}

export interface GetUsersResponse extends CommonGetAllResponse {
  users: User[];
}
