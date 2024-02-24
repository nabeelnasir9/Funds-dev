import { HttpCommonResponse, CommonGetAllResponse } from "@/lib/interfaces";

export class UserClass {
  constructor(
    public _id: string = "",
    public title: string = "",
    public leaveType: string = "",
    public reason: any = "",
    public leaveDate: string = "",
    public createdAt: string = "",
    public status: string = "",
    // public email: string = '',

    public name: string = "",
    public date: string = "",
    public attachment: any = "",

    public reasons: string = "",

    // public phone: string = '',
    // public current_balance: number = 123,
    // public isBanned: boolean = true,
    // public isCreator: boolean = true,
    // public isVerified: boolean = true,
    public leave: "Select type" | "sick" | "casual" = "Select type",
    // public access_level:
    // 	| 'read'
    // 	| 'create,read'
    // 	| 'create,read,update'
    // 	| 'create,read,update,delete' = 'read',
    // public role: 'user' | 'admin' = 'user',
    // public transactionIds: string[] = [],
    public created_at: string = "",
    public updated_at: string = ""
  ) {}
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
