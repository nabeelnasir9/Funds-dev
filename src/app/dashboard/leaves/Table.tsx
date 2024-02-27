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
  useCreateLeaveRequest,
  useGetLeaveRequest,
  useGetUsers,
  useUpdateUser,
  useDeleteUsers,
  useUploadUsers,
} from "./mutations";
import {
  createUserForm,
  updateUserForm,
  searchUserForm,
  createUserLeaveForm,
} from "./forms";

export function UsersTable({ className }: { className?: string }) {
  const searchQuery = useSearchQuery();

  const userLeaveRequest = useGetLeaveRequest(searchQuery.queryStr);
  const createLeaveRequest = useCreateLeaveRequest();
  const updateUser = useUpdateUser();
  const uploadUsers = useUploadUsers();
  const deleteUsers = useDeleteUsers();
  const [detailUser, setDetailUser] = React.useState<User | null>(null);
  const [formType, setFormType] = React.useState<"create" | "edit">("create");
  const formRef = React.useRef<React.ElementRef<"button">>(null);
  const detailsRef = React.useRef<React.ElementRef<"button">>(null);
  const [tableData, setTableData] = React.useState([]);

  React.useEffect(() => {
    const getReq = async () => {
      console.log("function called");
      let roleFormDb = await localStorage.getItem("role");
      let res = await userLeaveRequest.mutateAsync("ali");
      console.log(res.data, "response data");
      let newRes=res?.data.filter((req)=>req.status==="pending")
      if (roleFormDb == "hr") {
        let finalReq = newRes.filter(
          (item, i) => item.mangerApprove === "accept"
        );
        setTableData(finalReq);
        return;
      }
      setTableData(newRes);
    };
    getReq();
  }, []);

  const onSubmit = async (values: CreateUser) => {
    try {
      console.log(values, "value from the form");
      // toast.loading("adding cash request");
      let res = await createLeaveRequest.mutateAsync(values);
      console.log(res.message, "response from the store");

      if (res.message === "success") {
        // toast.dismiss();
        // toast.success("Successfully added request");
        formRef.current?.click();
      } else {
        throw new Error("something went wrong");
      }
    } catch (error) {
      console.log(error, "error");
      // toast.dismiss();
      // toast.error("some thing went wrong");
    }
  };

  const onUpdate = async (values: any) => {
    await updateUser.mutateAsync({ ...values, _id: detailUser?._id || "" });
  };

  const viewCustomerDetails = (index: number) => {
    if (userLeaveRequest?.data && userLeaveRequest?.data?.users[index]) {
      setDetailUser(users.data.users[index] as User);
      detailsRef.current?.click();
    }
  };

  const onEditUser = (index: number) => {
    if (userLeaveRequest?.data && userLeaveRequest?.data.users[index]) {
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
        { id: 0, columnDef: { header: "Sr." }, isPlaceholder: false },
        { id: 1, columnDef: { header: "Name" }, isPlaceholder: false },
        { id: 2, columnDef: { header: "Sick/casual" }, isPlaceholder: false },
        { id: 3, columnDef: { header: "Reason" }, isPlaceholder: false }, // Fixed typo in "Attachment"
        { id: 4, columnDef: { header: "Date" }, isPlaceholder: false },
        { id: 5, columnDef: { header: "Created At" }, isPlaceholder: false },
        // { id: 5, columnDef: { header: "Attachment" }, isPlaceholder: false }, // Fixed typo in "Attachment"
        { id: 6, columnDef: { header: "Status" }, isPlaceholder: false }, // Fixed typo in "Attachment"
        { id: 7, columnDef: { header: "HR" }, isPlaceholder: false }, 
        { id: 8, columnDef: { header: "Manager" }, isPlaceholder: false }, 
      ],
    },
  ];

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold "></h1>

        <h1 className="text-2xl font-bold text-center">Leaves Request</h1>
        <h1 className="text-2xl font-bold text-center">Balance: {10}</h1>
      </div>
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
      <hr className="bg-gray-300 mt-[20px]" />
      <CommonTable
        cashRequest={cashRequest}
        tableKey="leaves"
        columns={columns}
        hideRowActions={["create_invoice", "duplicate"]}
        data={tableData}
        loading={userLeaveRequest?.isLoading}
        onCreate={() => {
          setFormType("create");
          formRef?.current?.click();
        }}
        onEdit={onEditUser}
        onUpload={onUploadUsers}
        onViewDetails={viewCustomerDetails}
        onDeleteMany={onDeleteUsers}
        page={searchQuery.pagination.page}
        limit={searchQuery.pagination.limit}
        lastPage={0}
        totalDocuments={0}
        setPage={searchQuery.setPage}
        setLimit={searchQuery.setLimit}
      />
      <CommonModal ref={formRef} className="sm:min-w-[510px] lg:min-w-[800px]">
        <CommonForm
          type="modal"
          defaultObj={detailUser}
          operationType={formType}
          closeModal={() => formRef.current?.click()}
          extendedForm={
            formType === "create" ? createUserLeaveForm : updateUserForm
          }
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
