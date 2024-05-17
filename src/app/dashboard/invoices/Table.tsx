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
import { PdfDownload } from "./pdfDownload";
import axios from "axios";
import { memo } from "react";

export function UsersTable({ className }: { className?: string }) {
  const searchQuery = useSearchQuery();
  const DownloadPDF = memo(PdfDownload);


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
  const [companyFilter, setCompanyFilter] = React.useState<any>('Anaf');

  const [fileUrl, setFileUrl] = React.useState<any>("");
  const [detailLeave, setDetailLeave] = React.useState<any>();

  React.useEffect(() => {
    const getReq = async () => {
      console.log("function called");
      let roleFormDb = await localStorage.getItem("role");
      setRole(roleFormDb?.toLowerCase());
      let res: any = await userPassoutRequest.mutateAsync("ali");
      console.log(res.data, "response data");
      let newRes: any = res?.data.filter(
        (req: any) => req.status === "pending" && req?.invoiceToCompany === companyFilter.toLowerCase()
      );
      let acceptCash: any = res?.data.filter(
        (req: any) => req.status !== "pending"
      );
      setAcceptedPassOut(acceptCash);
      if (roleFormDb == "accountant") {
        let finalReq = newRes.filter(
          (item: any, i: any) => item.managerApprove === "accept"
        );
        setTableData(finalReq);
        return;
      }
      setTableData(newRes);
    };
    // const intervalId = setInterval(() => {
    //   getReq();
    // }, 20000);

    getReq();

    // return () => clearInterval(intervalId);
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
      console.log(values, "value from the form");

      const imageUrl = await uploadImage(values.attachment);
      values.attachment = imageUrl;

      // toast.loading("adding cash request");
      let res = await createPassoutRequest.mutateAsync(values);
      console.log(res.message, "response from the store");

      if (res.message === "success") {
        // toast.dismiss();
        setRequestMade(!requestMade);
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

  const viewLeaveRequest = (data: any) => {
    {
      console.log(data, "userPdfData");

      if (userPassoutRequest?.data && data) {
        const leaveRequest =  data ;
        delete leaveRequest.userId; // Remove the userId object
        console.log(leaveRequest, "leaveRequest without userId");

        setDetailLeave(leaveRequest); // Save the modified leaveRequest in state
        detailsRef.current?.click();
        const downloadPdf = async (obj: Record<string, any>) => {
          console.log("Download PDF");
          let config:any = {
            method: 'post',
            url: 'http://159.65.246.131/generate-pdf',
            headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/pdf'
            },
            responseType: 'blob', // Ensure response is treated as a Blob
            data: obj
          };
          
          try {
            const response = await axios.request(config);
          
            // Download PDF
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
          
            const link = document.createElement('a');
            link.href = url;
            link.download = 'invoices.pdf';
            link.click();
          
            window.URL.revokeObjectURL(url); // Clean up
          } catch (error) {
            console.error('Error downloading PDF:', error);
          }
          }

          downloadPdf(leaveRequest)
          

	// downloadPdf(detailLeave)
      }
    }
  };

  const useViewCustomerDetails = (index: number) => {
    const users: any = useDeleteUsers();
    if (users?.data && users?.data?.users[index]) {
      setDetailUser(users.data.users[index] as User);
      // detailsRef.current?.click();
    }
  };

  const useOnEditUser = (index: number) => {
    const users: any = useDeleteUsers();

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

  // const cashRequest: CashRequest = [
  //   {
  //     id: 1,
  //     headers: [
  //       { id: 0, columnDef: { header: "Sr." }, isPlaceholder: false },
  //       { id: 9, columnDef: { header: "User Name" }, isPlaceholder: false },
  //       { id: 1, columnDef: { header: "Title" }, isPlaceholder: false },
  //       // { id: 4, columnDef: { header: "Sick/casual" }, isPlaceholder: false },
  //       // { id: 5, columnDef: { header: "Reason" }, isPlaceholder: false }, // Fixed typo in "Attachment"
  //       { id: 3, columnDef: { header: "Date" }, isPlaceholder: false },
  //       { id: 7, columnDef: { header: "Accountant" }, isPlaceholder: false },
  //       { id: 8, columnDef: { header: "Manager" }, isPlaceholder: false },
  //       { id: 6, columnDef: { header: "Status" }, isPlaceholder: false }, // Fixed typo in "Attachment"
        
  //     ],
  //   },
  // ];
  const cashRequest: CashRequest = [
    {
      id: 1,
      headers:[
        { id: 0, columnDef: { header: "Sr." }, isPlaceholder: false },
        { id: 9, columnDef: { header: "User Name" }, isPlaceholder: false },
        { id: 1, columnDef: { header: "Title" }, isPlaceholder: false },
        { id: 4, columnDef: { header: "Sick/casual" }, isPlaceholder: false },
        { id: 7, columnDef: { header: "Accountant" }, isPlaceholder: false },
        { id: 8, columnDef: { header: "Manager" }, isPlaceholder: false },
        { id: 6, columnDef: { header: "Status" }, isPlaceholder: false },
        { id: 10, columnDef: { header: "Invoice No." }, isPlaceholder: false },
        { id: 2, columnDef: { header: "Invoice to Company" }, isPlaceholder: false },
        { id: 11, columnDef: { header: "Date of Invoice" }, isPlaceholder: false },
        { id: 12, columnDef: { header: "Invoice Description" }, isPlaceholder: false },
        { id: 13, columnDef: { header: "Total Amount" }, isPlaceholder: false },
        { id: 14, columnDef: { header: "Total Amount excl. VAT" }, isPlaceholder: false },
        { id: 15, columnDef: { header: "Expense" }, isPlaceholder: false },
        { id: 16, columnDef: { header: "Net Earning" }, isPlaceholder: false },
        { id: 17, columnDef: { header: "Percentage" }, isPlaceholder: false }
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
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold "></h1>

            <h1 className="text-2xl font-bold text-center">Invoices </h1>
            <h1 className="text-2xl font-bold "></h1>
          </div>
          <hr className="bg-gray-300 mt-[20px]" />
          <CommonTable
            cashRequest={cashRequest}
            tableKey="passout"
            columns={columns}
            hideRowActions={["create_invoice", "duplicate","attachment"]}
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
            downloadPdf={viewLeaveRequest}

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
            editIcon={ false}
            downloadIcon={true}
            differentCompanies={companyFilter}
            handleDropdownOption={ (e) => {
              console.log(e, "e");
              setRequestMade(!requestMade)
              setCompanyFilter(e);
            }}
          />
        </>
      )}
      <CommonModal ref={formRef} className="sm:min-w-[510px] lg:min-w-[800px]">
        <CommonForm
          type="modal"
          defaultObj={detailLeave}
          operationType={formType}
          closeModal={() => formRef.current?.click()}
          extendedForm={formType === "create" ? createUserForm : createUserForm}
          submitText={formType === "create" ? "Create" : "Update"}
          // onViewDetails={viewLeaveRequest}
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
        <DownloadPDF
        obj={detailLeave ? detailLeave : {}}
          // close={() => detailsRef.current?.click()}
        />
      </CommonModal>

      <h1 className="text-2xl font-bold text-center mt-[10px]">
        {" "}
        Invoices History
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
            editIcon={
             false
            }
            downloadIcon={true}
            downloadPdf={viewLeaveRequest}
            differentCompanies={companyFilter}
            handleDropdownOption={ (e) => {
              console.log(e, "e");
              setRequestMade(!requestMade)
              setCompanyFilter(e);
            }}

      />
    </div>
  );
}
