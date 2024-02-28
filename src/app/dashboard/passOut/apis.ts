import { http } from "@/lib/config";
import { apiUrls } from "@/lib/apis";
import { HttpCommonResponse } from "@/lib/interfaces";
import { GetUsersResponse, TableUser, CreateUser, User } from "./interfaces";
import { LoginResponse } from "@/app/login/interfaces";

export async function createPassoutRequest(data: CreateUser) {
  let userToken = await localStorage.getItem("token");

  const bodyData = { ...data, token: userToken };
  return http.post<LoginResponse>(apiUrls.users.addPassoutRequest, bodyData);
}

export async function getPassoutRequest(searchParams?: string) {
  let userToken = await localStorage.getItem("token");
  let role = localStorage.getItem("role");
  let bodyData;
  if (role === "employee") {
    bodyData = { token: userToken, employee: true };
  } else {
    bodyData = { token: userToken };
  }
  console.log(userToken, "============---------------------=", role);

  return http.post<GetUsersResponse>(
    `${apiUrls.users.getPassoutRequest}`,
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
