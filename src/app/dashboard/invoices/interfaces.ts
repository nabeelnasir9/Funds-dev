import { HttpCommonResponse, CommonGetAllResponse } from "@/lib/interfaces";

// export class UserClass {
//   constructor(
//     public _id: string = "",
//     public username: string = "",
//     public title: string = "",
//     // public reason: string = "",
//     public createdAt: string = "",
    
//     public accountantApprove: string = '',
// 		public managerApprove: string = '',
//     public status: string = "",
//     public attachment: string = "",
//     public created_at: string = "",
//     public name: string = '',
//     ) // public email: string = '',
//   // public phone: string = '',
//   // public date: string = '',
//   // public time: string = '',
//   // public current_balance: number = 123,
//   // public isBanned: boolean = true,
//   // public isCreator: boolean = true,
//   // public isVerified: boolean = true,

//   // public access_level:
//   // 	| 'read'
//   // 	| 'create,read'
//   // 	| 'create,read,update'
//   // 	| 'create,read,update,delete' = 'read',
//   // public role: 'user' | 'admin' = 'user',
//   // public transactionIds: string[] = [],
//   // public updated_at: string = '',
//   {}
// }
export class UserClass {
  constructor(
    public _id: string = "",
    public username: string = "",
    public invoiceNo: string = "",
    public title: string = "",
    public dateOfInvoice: string = "",
    public createdAt: string = "",
    public invoiceToCompany: string = "",
    public invoiceForCompany: string = "",
    public accountantApprove: string = '',
    public managerApprove: string = '',
    public status: string = "",
    public attachment: string = "",
    public created_at: string = "",
    public name: string = '',
    public invoiceDescription: string = "",
    public totalAmount: string = "",
    public totalAmountExclVAT: string = "",
    public expense: string = "",
    public netEarning: string = "",
    public percentage: string = "",
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
