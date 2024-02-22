import { http } from "@/lib/config";
import { apiUrls } from "@/lib/apis";
import { HttpCommonResponse } from "@/lib/interfaces";
import { GetUsersResponse, TableUser, CreateUser, User } from "./interfaces";
import { LoginResponse } from "@/app/login/interfaces";
import axios from "axios";

export function createCashRequest(data: CreateUser) {
  let userToken = localStorage.getItem("token");
  
  const bodyData={...data,token:userToken}
  console.log(userToken, "=============", bodyData);

  return http.post<LoginResponse>(apiUrls.users.addCashRequest, bodyData  );
}

export function getUsers(searchParams?: string) {
  return http.get<GetUsersResponse>(
    `${apiUrls.users.getAll}${searchParams ? searchParams : ""}`
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
