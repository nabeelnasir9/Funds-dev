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
  useCreateCashRequset,
  useGetCashRequest,
  useUpdateUser,
  useDeleteUsers,
  useUploadUsers,
} from "./mutations";
import {
  // updateUserForm,
  // searchUserForm,
  createCashRequestForm,
} from "./forms";
import toast from "react-hot-toast";

export function UsersTable({ className }: { className?: string }) {
  const searchQuery = useSearchQuery();

  const userCashRequest: any = useGetCashRequest(searchQuery.queryStr);
  const createCashRequset = useCreateCashRequset();
  const updateUser = useUpdateUser();
  const uploadUsers = useUploadUsers();
  const deleteUsers = useDeleteUsers();
  const [detailUser, setDetailUser] = React.useState<User | null>(null);
  const [formType, setFormType] = React.useState<"create" | "edit">("create");
  const formRef = React.useRef<React.ElementRef<"button">>(null);
  const detailsRef = React.useRef<React.ElementRef<"button">>(null);
  const [tableData, setTableData] = React.useState([]);
  const [acceptedCash, setAcceptedCash] = React.useState([]);
  const [role, setRole] = React.useState();
  const [requestMade, setRequestMade] = React.useState(false);

  const [fileUrl, setFileUrl] = React.useState<any>("");
  const [detailLeave, setDetailLeave] = React.useState<any>();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        let roleFormDb: any =
          (await localStorage.getItem("role"))?.toUpperCase() ?? "employee";
        setRole(roleFormDb);
        console.log("function called----------------", roleFormDb);

        let res = await userCashRequest.mutateAsync("ali");
        console.log(res.data, "response data");
        let newRes = res?.data.filter((req: any) => req.status === "pending");
        let acceptCash = res?.data.filter(
          (req: any) => req.status !== "pending"
        );
        setAcceptedCash(acceptCash);

        let finalReq;
        if (roleFormDb == "ACCOUNTANT") {
          finalReq = newRes.filter(
            (item: any) => item.mangerApprove === "accept"
          );
        } else if (roleFormDb.toLowerCase() === "manager") {
          finalReq = newRes.filter(
            (item: any) => item.mangerApprove === "pending"
          );
        } else {
          finalReq = newRes;
        }
        setTableData(finalReq);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // const intervalId = setInterval(() => {
    //   fetchData();
    // }, 20000);

    fetchData(); // Fetch data initially when component mounts

    // return () => clearInterval(intervalId); // Cleanup function to clear interval
  }, [requestMade]);

  const uploadImage = async (e: any) => {
    const files = e;
    const data = new FormData();
    data.append("file", files);
    data.append("upload_preset", "dsuzcga3"); // Replace with your upload preset
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/datptkvvx/image/upload", // Replace with your cloud name
      {
        method: "POST",
        body: data,
      }
    );
    const file = await res.json();

    setFileUrl(file.secure_url);
    return file.secure_url;
  };

  const onSubmit = async (values: CreateUser) => {
    try {
      console.log(values, "value from the form ------------------------------------");
      const imageUrl = await uploadImage(values.attachment);
      values.attachment = imageUrl;

      // toast.loading("adding cash request");
      let res = await createCashRequset.mutateAsync(values);
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

  const viewLeaveRequest = (index: number) => {
    {
      console.log(userCashRequest?.data.data[index], "userLeaveRequest");
      console.log("viewLeaveRequest", index);

      if (userCashRequest?.data && userCashRequest?.data.data[index]) {
        const leaveRequest = { ...userCashRequest.data.data[index] };
        delete leaveRequest.userId; // Remove the userId object
        console.log(leaveRequest, "leaveRequest without userId");

        setDetailLeave(leaveRequest); // Save the modified leaveRequest in state
        detailsRef.current?.click();
      }
    }
  };

  const useViewCustomerDetails = (index: number) => {
    const users: any = useUpdateUser(); // Declare the 'users' variable
    if (users?.data && users?.data?.users[index]) {
      setDetailUser(users.data.users[index] as User);
      detailsRef.current?.click();
    }
  };

  const useOnEditUser = (index: number) => {
    const users: any = useUpdateUser(); // Declare the 'users' variable
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

  console.log(columns, "===========columns===========");

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
        { id: 2, columnDef: { header: "Amount" }, isPlaceholder: false },
        // { id: 3, columnDef: { header: "Type" }, isPlaceholder: false },
        { id: 5, columnDef: { header: "CreatedAt" }, isPlaceholder: false },
        { id: 6, columnDef: { header: "updatedAt" }, isPlaceholder: false },
        { id: 8, columnDef: { header: "Manager" }, isPlaceholder: false },
        { id: 7, columnDef: { header: "Accountant" }, isPlaceholder: false },
        { id: 4, columnDef: { header: "Status" }, isPlaceholder: false },
        // ...(role !== "employee" ? [
        //   { id: 7, columnDef: { header: "Reject" }, isPlaceholder: false },
        //   { id: 8, columnDef: { header: "Approve" }, isPlaceholder: false }
        // ] : [])
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
        { id: 4, columnDef: { header: "Status" }, isPlaceholder: false }, // Fixed typo in "Attachment"
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
      localStorage.getItem("role") === "hr" ? null : (
        <>
          <h1 className="text-2xl font-bold text-center">New Cash Request</h1>
          <hr className="bg-gray-300 mt-[20px]" />
          <CommonTable
            cashRequest={cashRequest}
            tableKey="cash"
            columns={columns}
            hideRowActions={["create_invoice", "duplicate", "attachment"]}
            data={tableData}
            loading={userCashRequest?.isLoading}
            onCreate={() => {
              setFormType("create");
              formRef?.current?.click();
            }}
            tableData={tableData}
            setTableDataFun={setTableData}
            historyData={acceptedCash}
            setHistoryData={setAcceptedCash}
            onEdit={useOnEditUser}
            onUpload={onUploadUsers}
            onViewDetails={viewLeaveRequest}
            onDeleteMany={onDeleteUsers}
            page={1}
            limit={10}
            lastPage={0}
            // lastPage={users?.data?.pagination.last_page || 0}
            totalDocuments={0}
            // totalDocuments={users?.data?.pagination.total_count || 0}
            setPage={searchQuery.setPage}
            setLimit={searchQuery.setLimit}
            attachment={true}
            editIcon={
              localStorage.getItem("role") === "employee" ? true : false
            }
          />
        </>
      )}
      <CommonModal ref={formRef} className="sm:min-w-[510px] lg:min-w-[800px]">
        <CommonForm
          type="modal"
          defaultObj={detailLeave}
          operationType={formType}
          closeModal={() => formRef.current?.click()}
          extendedForm={
            formType === "create"
              ? createCashRequestForm
              : createCashRequestForm
          }
          submitText={formType === "create" ? "Create" : "Update"}
          cancelText="Cancel"
          submitFunc={(values) =>
            formType === "create"
              ? onSubmit(values as CreateUser)
              : onUpdate(values as any)
          }
          onDuplicate={() => {}}
          onViewDetails={viewLeaveRequest}
        />
      </CommonModal>

      <CommonModal ref={detailsRef}>
        <ShowDetails
          obj={detailLeave ? detailLeave : {}}
          close={() => detailsRef.current?.click()}
        />
      </CommonModal>
      {/* ////////////////Cash History/////////// */}

      <h1 className="text-2xl font-bold text-center mt-[10px]">
        {" "}
        Cash History
      </h1>
      <hr className="bg-gray-300 mt-[20px]" />

      <CommonTable
        cashRequest={cashRequest}
        tableKey="history"
        columns={columns}
        hideRowActions={["create_invoice", "duplicate"]}
        data={acceptedCash}
        loading={userCashRequest?.isLoading}
        // onCreate={() => {
        //   setFormType("create");
        //   formRef?.current?.click();
        // }}
        tableData={tableData}
        setTableDataFun={setTableData}
        historyData={acceptedCash}
        setHistoryData={setAcceptedCash}
        onEdit={useOnEditUser}
        onUpload={onUploadUsers}
        onViewDetails={useViewCustomerDetails}
        onDeleteMany={onDeleteUsers}
        page={1}
        limit={10}
        lastPage={0}
        // lastPage={users?.data?.pagination.last_page || 0}
        totalDocuments={0}
        // totalDocuments={users?.data?.pagination.total_count || 0}
        setPage={searchQuery.setPage}
        setLimit={searchQuery.setLimit}
        attachment={true}
        editIcon={
          false
        }
      />
    </div>
  );
}
