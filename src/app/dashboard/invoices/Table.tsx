"use client";

import * as React from "react";
import { Filter } from "lucide-react";

import { useSearchQuery } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import {
  CommonTable,
  CommonForm,
  CommonAccordion,
  CommonModal,
  ShowDetails,
} from "@/components";
import { type User, type CreateUser, UserClass } from "./interfaces";
import {
  useCreateUser,
  useGetUsers,
  useUpdateUser,
  useDeleteUsers,
  useUploadUsers,
} from "./mutations";
import { createUserForm, updateUserForm, searchUserForm } from "./forms";
import { getUsers } from "./apis";

export function UsersTable({ className }: { className?: string }) {
  const searchQuery = useSearchQuery();

  const users = useGetUsers(searchQuery.queryStr);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const uploadUsers = useUploadUsers();
  const deleteUsers = useDeleteUsers();
  const [detailUser, setDetailUser] = React.useState<User | null>(null);
  const [formType, setFormType] = React.useState<"create" | "edit">("create");
  const formRef = React.useRef<React.ElementRef<"button">>(null);
  const detailsRef = React.useRef<React.ElementRef<"button">>(null);

  const onSubmit = async (values: CreateUser) => {
    await createUser.mutateAsync(values);
  };

  const onUpdate = async (values: any) => {
    await updateUser.mutateAsync({ ...values, _id: detailUser?._id || "" });
  };

  const useViewCustomerDetails = (index: number) => {
    const users:any = useGetUsers()
    if (users?.data && users?.data?.users[index]) {
      setDetailUser(users.data.users[index] as User);
      detailsRef.current?.click();
    }
  };

  const useOnEditUser = (index: number) => {
    const users:any = useGetUsers()
    if (users?.data && users?.data.users[index]) {
      setFormType("edit");
      setDetailUser(users?.data.users[index] as User);
      formRef.current?.click();
    }
  };

  const onUploadUsers = async (file: File) => {
    await uploadUsers.mutateAsync(file);
  };

  const onDeleteUsers = async (ids: string[]) => {
    await deleteUsers.mutateAsync(ids);
  };

  const columns = Object.keys(new UserClass()).filter(
    (column) => column !== "_id"
  );

  type CashRequestHeader = {
    id: number;
    columnDef: {
      header: string;
    };
    isPlaceholder: boolean;
  };
  
  type CashRequestItem = {
    id: number;
    headers: CashRequestHeader[];
  };
  
  type CashRequest = CashRequestItem[];
  
  const cashRequest: CashRequest = [
    {
      id: 1,
      headers: [
        { id: 1, columnDef: { header: "Tite" }, isPlaceholder: false },
        { id: 2, columnDef: { header: "Amount" }, isPlaceholder: false },
        { id: 3, columnDef: { header: "Advance/paid" }, isPlaceholder: false },
        { id: 3, columnDef: { header: "Attachment" }, isPlaceholder: false }, // Fixed typo in "Attachment"
      ],
    },
  ];
  const cashHistory: any = [
    {
      id: 1,
      headers: [
        { id: 1, columnDef: { header: "Tite" }, isPlaceholder: false },
        { id: 2, columnDef: { header: "Amount" }, isPlaceholder: false },
        { id: 3, columnDef: { header: "Date" }, isPlaceholder: false },
        { id: 3, columnDef: { header: "Status" }, isPlaceholder: false }, // Fixed typo in "Attachment"
      ],
    },
  ];
  return (
    <div className={cn("w-full", className)}>
      <h1 className="text-2xl font-bold text-center"> Invoices</h1>
      {/* <CommonAccordion
        accordions={[
          {
            label: (
              <div className="flex gap-2">
                <Filter className="h-6 w-6" />
                Filters
              </div>
            ),
            content: (
              <CommonForm
                type="form"
                defaultObj={searchQuery.filterObj}
                operationType="edit"
                extendedForm={searchUserForm}
                submitText="Search"
                cancelText="Cancel"
                submitFunc={searchQuery.setQuery}
                onDuplicate={() => {}}
              />
            ),
          },
        ]}
      /> */}
      <hr className="bg-gray-300" />
      <CommonTable
        cashRequest={cashRequest}
        tableKey="cash"
        columns={columns}
        hideRowActions={["create_invoice", "duplicate"]}
        data={users?.data?.users || []}
        loading={users?.isLoading}
        onCreate={() => {
          setFormType("create");
          formRef?.current?.click();
        }}
        onEdit={useOnEditUser}
        onUpload={onUploadUsers}
        onViewDetails={useViewCustomerDetails}
        onDeleteMany={onDeleteUsers}
        page={searchQuery.pagination.page}
        limit={searchQuery.pagination.limit}
        lastPage={users?.data?.pagination.last_page || 0}
        totalDocuments={users?.data?.pagination.total_count || 0}
        setPage={searchQuery.setPage}
        setLimit={searchQuery.setLimit}
      />
      <CommonModal ref={formRef} className="sm:min-w-[510px] lg:min-w-[800px]">
        <CommonForm
          type="modal"
          defaultObj={detailUser}
          operationType={formType}
          closeModal={() => formRef.current?.click()}
          extendedForm={formType === "create" ? createUserForm : updateUserForm}
          submitText={formType === "create" ? "Create" : "Update"}
          cancelText="Cancel"
          submitFunc={(values) =>
            formType === "create"
              ? onSubmit(values as CreateUser)
              : onUpdate(values as any)
          }
          onDuplicate={() => {}}
        />
      </CommonModal>

      <CommonModal ref={detailsRef}>
        <ShowDetails
          obj={detailUser ? detailUser : {}}
          close={() => detailsRef.current?.click()}
        />
      </CommonModal>

     
    </div>
  );
}
