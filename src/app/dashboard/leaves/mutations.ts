import toast from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "@/lib/config";
import {
  getLeaveRequest,
  createLeaveRequest,
  updateUser,
  deleteUsers,
  uploadUsers,
} from "./apis";
import { type CreateUser, type User } from "./interfaces";

export function useCreateLeaveRequest() {
  let loadingToast: any;
  return useMutation({
    mutationKey: ["createLeaveRequest"],
    mutationFn: async (params: CreateUser) => {
      toast.dismiss()

      loadingToast = toast.loading("Adding Leave Request");
      const res = await createLeaveRequest(params);
      return res;
    },
    onSuccess: (response) => {

      toast.dismiss(loadingToast);
      if (response.message === "success") {
      toast.dismiss()

        toast.success("Leave request Added");
        // queryClient.invalidateQueries({ queryKey: ['get_users'] })
      } else {
      toast.dismiss()

        toast.error(`Error: ${response.message}`);
      }
    },
    onError: (e) => {
      toast.dismiss(loadingToast);
      toast.error(String(e));
    },
  });
}

export function useGetLeaveRequest(searchParams?: string) {
  let loadingToast: any;
  return useMutation({
    mutationKey: ["getLeaveRequest"],
    mutationFn: async (params: any) => {
      toast.dismiss();

      loadingToast = toast.loading("Getting Leave Request");
      const res = await getLeaveRequest(searchParams);
      return res;
    },
    onSuccess: (response) => {
      toast.dismiss(loadingToast);
      if (response.message === "success") {
        toast.dismiss();

        toast.success(" Leave Request Success");
        // queryClient.invalidateQueries({ queryKey: ['get_users'] })
      } else {
        toast.dismiss();

        toast.error(`Error: ${response.message}`);
      }
    },
    onError: (e) => {
      toast.dismiss(loadingToast);
      toast.error(String(e));
    },
  });
  // return useQuery({
  // 	queryKey: ['get_users', searchParams],
  // 	queryFn: () => getUsers(searchParams),
  // })
}

export function useUpdateUser() {
  let loadingToast: any;
  return useMutation({
  	mutationKey: ['update_user'],
  	mutationFn: async (params: User) => {
  		loadingToast = toast.loading('Updating User')
  		const res = await updateUser(params)
  		return res
  	},
  	onSuccess: (response) => {
  		toast.dismiss(loadingToast)
  		if (response.status === 200) {
  			toast.success('User Updated')
  			queryClient.invalidateQueries({ queryKey: ['get_users'] })
  		} else {
  			toast.error(`Error: ${response.message}`)
  		}
  	},
  	onError: (e) => {
  		toast.dismiss(loadingToast)
  		toast.error(String(e))
  	},
  })
}

export function useDeleteUsers() {
  let loadingToast: any;
  return useMutation({
  	mutationKey: ['delete_users'],
  	mutationFn: async (ids: string[]) => {
  		loadingToast = toast.loading('Deleting Users')
  		const res = await deleteUsers(ids)
  		return res
  	},
  	onSuccess: (response) => {
  		toast.dismiss(loadingToast)
  		if (response.status === 200) {
  			toast.success('Users Deleted')
  			queryClient.invalidateQueries({ queryKey: ['get_users'] })
  		} else {
  			toast.error(`Error: ${response.message}`)
  		}
  	},
  	onError: (e) => {
  		toast.dismiss(loadingToast)
  		toast.error(String(e))
  	},
  })
}

export function useUploadUsers() {
  let loadingToast: any;
  return useMutation({
  	mutationKey: ['upload_users'],
  	mutationFn: async (param: File) => {
  		loadingToast = toast.loading('Uploading Users')
  		const res = await uploadUsers(param)
  		return res
  	},
  	onSuccess: (response) => {
  		toast.dismiss(loadingToast)
  		if (response.status === 200) {
  			toast.success('Users Uploaded')
  			queryClient.invalidateQueries({ queryKey: ['get_users'] })
  		} else {
  			toast.error(`Error: ${response.message}`)
  		}
  	},
  	onError: (e) => {
  		toast.dismiss(loadingToast)
  		toast.error(String(e))
  	},
  })
}
