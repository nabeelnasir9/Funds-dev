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
  useCreatePassoutRequest,
  useUserGetPassoutRequest,
  useUpdateUser,
  useDeleteUsers,
  useUploadUsers,
} from "./mutations";
import {
  createUserForm,
  // updateUserForm,
  //  searchUserForm
} from "./forms";
import { apiUrls } from "@/lib/apis";
import { http } from "@/lib/config";
// import { useUpdateUser } from "../invoices/mutations";

export function UsersTable({ className }: { className?: string }) {
  const searchQuery = useSearchQuery();

  const userPassoutRequest: any = useUserGetPassoutRequest(
    searchQuery.queryStr
  );
  const createPassoutRequest = useCreatePassoutRequest();
  const updateUser = useUpdateUser();
  const uploadUsers = useUploadUsers();
  const deleteUsers = useDeleteUsers();
  const [detailUser, setDetailUser] = React.useState<User | null>(null);
  const [formType, setFormType] = React.useState<"create" | "edit">("create");
  const formRef = React.useRef<React.ElementRef<"button">>(null);
  const detailsRef = React.useRef<React.ElementRef<"button">>(null);
  const [tableData, setTableData] = React.useState([]);
  const [acceptedPassOut, setAcceptedPassOut] = React.useState<any>([]);
  const [role, setRole] = React.useState<any>();
  const [requestMade, setRequestMade] = React.useState(false);
  const [user, setUser] = React.useState<any>();



  React.useEffect(() => {
    const getUser = async () => {
      try {
        let userToken = localStorage.getItem("token");

        const bodyData = { token: userToken };
        console.log(userToken, "=============", bodyData);
        let res: any = await http.post(apiUrls.users.me, bodyData);
        console.log(res, "---------------------------");
        setUser(res?.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);
  React.useEffect(() => {
    const getReq = async () => {
      console.log("function called");
      let roleFormDb = await localStorage.getItem("role");
      setRole(roleFormDb?.toLowerCase());
      let res: any = await userPassoutRequest.mutateAsync("ali");
      console.log(res.data, "response data");
      let newRes: any = res?.data.filter(
        (req: any) => req.status === "pending"
      );
      let acceptCash: any = res?.data.filter(
        (req: any) => req.status !== "pending"
      );
      setAcceptedPassOut(acceptCash);
      if (roleFormDb == "hr") {
        let finalReq = newRes.filter(
          (item: any, i: any) => item.mangerApprove === "accept"
        );
        setTableData(finalReq);
        return;
      }else{
      setTableData(newRes);}
    };
    // const intervalId = setInterval(() => {
    //   getReq();
    // }, 20000);

    getReq();

    // return () => clearInterval(intervalId);
  }, [requestMade]);

  const onSubmit = async (values: CreateUser) => {
    try {
      console.log(values, "value from the form");
      // toast.loading("adding cash request");
      let res = await createPassoutRequest.mutateAsync(values);
      console.log(res.message, "response from the store");

      if (res.message === "success") {
        // toast.dismiss();
        setRequestMade(true);
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

  const useViewCustomerDetails = (index: number) => {
    const users: any = useUpdateUser();
    if (users?.data && users?.data?.users[index]) {
      setDetailUser(users.data.users[index] as User);
      detailsRef.current?.click();
    }
  };

  const useOnEditUser = (index: number) => {
    const users: any = useUpdateUser();

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
        { id: 0, columnDef: { header: "Sr." }, isPlaceholder: false },
        { id: 9, columnDef: { header: "User Name" }, isPlaceholder: false },

        { id: 1, columnDef: { header: "Title" }, isPlaceholder: false },
        // { id: 2, columnDef: { header: "PassOut Time" }, isPlaceholder: false },
        
        // { id: 4, columnDef: { header: "Sick/casual" }, isPlaceholder: false },
        { id: 5, columnDef: { header: "Reason" }, isPlaceholder: false }, // Fixed typo in "Attachment"
        { id: 4, columnDef: { header: "Date" }, isPlaceholder: false },
        { id: 2, columnDef: { header: "Time From" }, isPlaceholder: false },
        { id: 3, columnDef: { header: "Time To" }, isPlaceholder: false },
        { id: 6, columnDef: { header: "No of Minutes" }, isPlaceholder: false },
        { id: 7, columnDef: { header: "HR" }, isPlaceholder: false },
        { id: 8, columnDef: { header: "Manager" }, isPlaceholder: false },
        { id: 10, columnDef: { header: "Status" }, isPlaceholder: false }, // Fixed typo in "Attachment"
      ],
    },
  ];

  return (
    <div className={cn("w-full", className)}>
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
      {localStorage.getItem("role") === "superAdmin" ||
      localStorage.getItem("role") === "accountant" ? null : (
        <>
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold "></h1>

            <h1 className="text-2xl font-bold text-center">Pass Outs </h1>
            {user?.role == "employee" && (
          <div>
            <h1 className="text-[16px] font-bold ">
              Sick Leave Balance: {user?.leavesBalance?.sick}
            </h1>
            <h1 className="text-[16px] font-bold ">
              Casual Leave Balance: {user?.leavesBalance?.casual}
            </h1>
          </div>
        )}
        {user?.role !== "employee" && <h1 className="text-2xl font-bold "></h1>}
          </div>
          <hr className="bg-gray-300 mt-[20px]" />
          <CommonTable
            cashRequest={cashRequest}
            tableKey="passout"
            columns={columns}
            hideRowActions={["create_invoice", "duplicate"]}
            data={tableData}
            loading={userPassoutRequest?.isLoading}
            onCreate={() => {
              setFormType("create");
              formRef?.current?.click();
            }}
            tableData={tableData}
            setTableDataFun={setTableData}
            historyData={acceptedPassOut}
            setHistoryData={setAcceptedPassOut}
            onEdit={useOnEditUser}
            onUpload={onUploadUsers}
            onViewDetails={useViewCustomerDetails}
            onDeleteMany={onDeleteUsers}
            page={searchQuery.pagination.page}
            limit={searchQuery.pagination.limit}
            lastPage={0}
            totalDocuments={10}
            // lastPage={users?.data?.pagination.last_page || 0}
            // totalDocuments={users?.data?.pagination.total_count || 0}
            setPage={searchQuery.setPage}
            setLimit={searchQuery.setLimit}
            attachment={true}
            editIcon={false}
          />
        </>
      )}
      <CommonModal ref={formRef} className="sm:min-w-[510px] lg:min-w-[800px]">
        <CommonForm
          type="modal"
          defaultObj={detailUser}
          operationType={formType}
          closeModal={() => formRef.current?.click()}
          extendedForm={formType === "create" ? createUserForm : createUserForm}
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

      <h1 className="text-2xl font-bold text-center mt-[10px]">
        {" "}
        PassOut History
      </h1>
      <hr className="bg-gray-300 mt-[20px]" />

      <CommonTable
        cashRequest={cashRequest}
        tableKey="history"
        columns={columns}
        hideRowActions={["create_invoice", "duplicate"]}
        data={acceptedPassOut}
        loading={acceptedPassOut?.isLoading}
        tableData={tableData}
        setTableDataFun={setTableData}
        historyData={acceptedPassOut}
        setHistoryData={setAcceptedPassOut}
        onEdit={useOnEditUser}
        onUpload={onUploadUsers}
        onViewDetails={useViewCustomerDetails}
        onDeleteMany={onDeleteUsers}
        page={searchQuery.pagination.page}
        limit={searchQuery.pagination.limit}
        lastPage={0}
        totalDocuments={10}
        // lastPage={users?.data?.pagination.last_page || 0}
        // totalDocuments={users?.data?.pagination.total_count || 0}
        setPage={searchQuery.setPage}
        setLimit={searchQuery.setLimit}
        attachment={true}
        editIcon={false}
      />
    </div>
  );
}
