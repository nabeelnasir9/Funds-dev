import { http } from "@/lib/config";
import { apiUrls } from "@/lib/apis";
import { HttpCommonResponse } from "@/lib/interfaces";
import { GetUsersResponse, TableUser, CreateUser, User } from "./interfaces";
import { LoginResponse } from "@/app/login/interfaces";

export async function createLeaveRequest(data: CreateUser) {
  let userToken = await localStorage.getItem("token");

  console.log("datauser wala ha ",data)
  const bodyData = { ...data, token: userToken };
  return http.post<LoginResponse>(apiUrls.users.addLeaveRequest, bodyData);
}

export async function getLeaveRequest(searchParams?: string) {
  let userToken = await localStorage.getItem("token");
  let role = localStorage.getItem("role");
  let bodyData;
  if (role === "employee") {
    bodyData = { token: userToken, employee: true };
  }  else if (role === "superAdmin") {
    bodyData = { token: userToken, admin: true };
  } 
   else {
    bodyData = {  token: userToken };
  }
  console.log(userToken, "=======----------------------======", role);

  return http.post<GetUsersResponse>(
    `${apiUrls.users.getLeaveRequest}`,
    bodyData
  );
}

export function updateUser(data: User) {
  return http.put<TableUser[]>(apiUrls.users.update, data);
}

export function deleteUsers(ids: string[]) {
  return http.delete<TableUser[]>(apiUrls.users.deleteMultiple, { data: ids });
}

export function uploadUsers(excel: File) {
  const formData = new FormData().append("file", excel);
  return http.post<HttpCommonResponse>(apiUrls.users.upload, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
