import toast from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "@/lib/config";
import {
  getInvoiceRequest,
  createInvoiceRequest,
  updateUser,
  deleteUsers,
  uploadUsers,
} from "./apis";
import { type CreateUser, type User } from "./interfaces";

export function useCreatePassoutRequest() {
  let loadingToast: any;
  return useMutation({
    mutationKey: ["createPassoutRequest"],
    mutationFn: async (params: CreateUser) => {
      toast.dismiss();

      loadingToast = toast.loading("Adding Invoice Request");
      const res = await createInvoiceRequest(params);
      console.log("🚀 ~ mutationFn: ~ res:", res)
      
      return res;
    },
    onSuccess: (response) => {
      toast.dismiss(loadingToast);
      if (response.message === "success") {
        toast.dismiss();

        toast.success("Invoice request Added");
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
}

export function useUserGetPassoutRequest(searchParams?: string) {
  let loadingToast: any;
  return useMutation({
    mutationKey: ["getLeaveRequest"],
    mutationFn: async (params: any) => {
      toast.dismiss();
      loadingToast = toast.loading("Getting Invoice Request");
      const res = await getInvoiceRequest(searchParams);
      console.log("🚀 ~ mutationFn: ~ res:", res)
      return res;
    },
    onSuccess: (response) => {
      toast.dismiss(loadingToast);
      if (response.message === "success") {
        toast.dismiss();

        toast.success("Invoice Request Success");
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
