import * as React from "react";
import {
  ChevronDownIcon,
  Cross1Icon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  FileEdit,
  Trash,
  CheckCircle2,
  XCircle,
  ChevronUp,
  ChevronDown,
  Trash2,
} from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type CellContext,
} from "@tanstack/react-table";
import Loading from "react-loading";
import {
  ChevronRight,
  ChevronsRight,
  ChevronLeft,
  ChevronsLeft,
} from "lucide-react";
import toast from "react-hot-toast";

import { PAGINATION_LIMIT, env } from "@/lib/config";
import {
  snakeCaseToNormal,
  copyObjectToClipBoard,
  exportJsonToExcel,
} from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import UploadData from "./UploadData";
import { CommonAccordion } from ".";
import axios from "axios";
import { http } from "@/lib/config";
import { apiUrls } from "@/lib/apis";
import { usePathname } from "next/navigation";
const commonTableRowActions = [
  "view_details",
  "copy_details",
  "duplicate",
  "create_invoice",
  "create_voucher",
  "attachment",
] as const;

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

export type CommonTableProps = {
  tableKey: string;
  data: any;
  cashRequest: any[];
  columns: string[];
  hideRowActions?: (typeof commonTableRowActions)[number][];
  onCreate?: () => void;
  onEdit: (index: number) => void;
  onViewDetails: (index: number) => void;
  onUpload?: (file: File) => void;
  onDeleteMany: (ids: string[]) => void;
  page: number;
  limit: number;
  lastPage: number;
  totalDocuments: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  loading: boolean;
  onDuplicate?: (values: any) => void;
  customActionsComponents?: (rows: any) => React.ReactNode;
  fieldsToCopy?: string[];
  hideActions?: boolean;
  actions?: Array<{ label: string; onClick: () => void }>;
  accordion?: string[];
  onDeleteSubAccount?: (data: any) => void;
  onDeleteCostCenter?: (data: any) => void;
  onDeleteOne?: (id: any) => void;

  tableData?: any;
  setTableDataFun?: any;
  historyData?: any;
  setHistoryData?: any;
  attachment?: boolean;
  editIcon?: boolean;
};

export type TableMeta = Pick<CommonTableProps, "onEdit">;

export function CommonTable(props: CommonTableProps) {
  const pathname = usePathname();
  let pathName = pathname.split("/");
console.log(props.data,"-------------------------------accepted data");

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [isOpen, setIsOpen] = React.useState<any>(false);
  const [attachmentNote, setAttachmentNote] = React.useState<any>("");
  const [requireFileModal, setRequireFileModal] = React.useState<any>(false);
  const [note, setNote] = React.useState<any>(false);
  const [docId, setDocId] = React.useState<any>();
  const [attachmentFile, setAttachmentFile] = React.useState<any>();
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [roles, setRoles] = React.useState<any>(Array(4).fill("")); // Array of role states
  const handleChange = async (index: any, value: any) => {
    let valuesFromStorage: any = await localStorage.getItem("rolesArray");
    let val = JSON.parse(valuesFromStorage);
    console.log(val, "-------valueas", index);

    if (
      (val[0] === "hr" || val[0] === "manager" || val[0] === "accountant") &&
      index != 0
    ) {
      toast.success("no need of HR or Manager");
      // setSelectDisable(true);
      await localStorage.setItem(
        "rolesArray",
        JSON.stringify([val[0], "", "", ""])
      );

      return;
    } else {
      console.log(index, "------------sent in func", value);
      setRoles((prevArray: any) => {
        const newArray = [...prevArray];
        newArray[index] = value; // Update the first element
        console.log(newArray, "-------------÷÷----------noew role before");
        return newArray;
      });
    }
  };

  const [selectDisable, setSelectDisable] = React.useState(false);

  React.useEffect(() => {
    console.log(roles, "roles ki array set ");
    const rolesArray = JSON.stringify(roles);
    localStorage.setItem("rolesArray", rolesArray);
  }, [roles]);

  // const initialVisibleColumns = React.useMemo(() => {
  // 	let hiddenColumns: Record<string, boolean> = {}
  // 	for (let i = 0; i < props.columns.length; i++) {
  // 		if (i < 5) {
  // 			hiddenColumns[props.columns[i]] = true
  // 		} else {
  // 			hiddenColumns[props.columns[i]] = false
  // 		}
  // 	}
  // 	return hiddenColumns
  // }, [])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const sendReqMore = async () => {
    try {
      toast.loading("loading");
      let userToken = await localStorage.getItem("token");
      let bodyData = {
        token: userToken,
        reqNote: note,
        docId: docId,
      };
      let res = await http.post(apiUrls.users.addReqMore, bodyData);

      if (res.message === "success") {
        toast.dismiss();
        toast.success("request sent");
        setIsOpen(false);
      }
    } catch (error) {}
  };

  const uploadImage = async () => {
    const files = attachmentFile;
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

    return file.secure_url;
  };

  const sendMoreFile = async () => {
    try {
      toast.loading("loading");
      const imageUrl = await uploadImage();

      let userToken = await localStorage.getItem("token");
      let bodyData = {
        token: userToken,
        docId: docId,
        attachment: imageUrl,
      };
      let res = await http.post(apiUrls.users.addMoreFile, bodyData);

      if (res.message === "success") {
        toast.dismiss();
        toast.success("request sent");
        setRequireFileModal(false);
      }
    } catch (error) {}
  };

  const handleApprove = async (id: any, status: any) => {
    try {
      toast.loading("loading");
      let userToken = await localStorage.getItem("token");
      let role = await localStorage.getItem("role");
      let rolesArray: any = await localStorage.getItem("rolesArray");
      let val = JSON.parse(rolesArray);
      if (val[0] === "hr" || val[0] === "manager") {
        (val[1] = ""), (val[2] = "");
      }
      let bodyData = {
        token: userToken,
        userRole: role,
        requestType: pathName[2],
        status,
        docId: id,
        approveUserData: val,
      };
      let res = await http.post(apiUrls.users.approveRequest, bodyData);

      if (res.message === "success") {
        if (role === "hr") {
          let approvedDoc;
          let updatedTableDate = props.tableData.filter((item: any, i: any) => {
            if (item._id !== id) {
              return item;
            } else {
              approvedDoc = { ...item, hrApprove: status, status: status };
            }
          });

          props.setTableDataFun(updatedTableDate);
          props.setHistoryData([...props.historyData, approvedDoc]);
        }
        if (role === "manager" || role === "md") {
          let approvedDoc;
          let updatedTableDate: any = props.tableData.filter(
            (item: any, i: any) => {
              if (item._id !== id) {
                return item;
              } else {
                if (status == "reject") {
                  approvedDoc = {
                    ...item,
                    managerApprove: status,
                    status: status,
                  };
                } else {
                  approvedDoc = {
                    ...item,
                    managerApprove: status,
                  };
                }
              }
            }
          );

          props.setTableDataFun(updatedTableDate);
          props.setHistoryData([...props.historyData, approvedDoc]);
        }
        toast.dismiss();
        toast.success("    Success");
      } else {
        toast.dismiss();

        toast.error(res.message);
      }
    } catch (error) {}
  };
  const [rowSelection, setRowSelection] = React.useState({});

  React.useEffect(() => {
    let r: any = localStorage.getItem("role");
    setRole(r);
  }, []);
  const [role, setRole] = React.useState("employee");

  const tableColums = React.useMemo(() => {
    let lenth = props.data.length;
    let i = 1;
    i = i + 1;
    const isMangerOrHr = role !== "employee"; // Check if the role is admin
    return [
      {
        id: "select",
        header: ({ table }: any) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }:any) => (
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={(value) => row.toggleSelected(!!value)}
						aria-label='Select row'
					/>
				),
        enableSorting: false,
        enableHiding: false,
      },
      ...[...props.columns, ...(props?.accordion ?? [])].map(
        (column, columnIndex) => ({
          accessorKey: column,
          header: <p className="capitalize">{snakeCaseToNormal(column)}</p>,
          
          // @ts-ignore
          cell: ({ row }) => {
            console.log("row", row);
            let value: any;
            
            try {

              value = row?.getValue(column || "");
            }
            catch (error) {
              console.log("error", error);
              window.location.reload();
            }
            return (
              <div className="flex flex-col" key={column}>
                {props?.accordion?.includes(column) ? (
                  <div>
                    {(value as any)?.map((item: any, i: number) => {
                      return (
                        <CommonAccordion
                          key={i}
                          accordions={[
                            {
                              label: (
                                <div className="flex justify-between gap-6 w-full">
                                  <p>{item?.cost_center}</p>
                                  <div
                                    onClick={() => {
                                      if (props?.onDeleteCostCenter) {
                                        props?.onDeleteCostCenter({
                                          main_account_id:
                                            row?.original?.main_account_id,
                                          cost_center_id: item?.cost_center_id,
                                        });
                                      }
                                    }}
                                  >
                                    <Trash2 color="red" height={16} />
                                  </div>
                                </div>
                              ),
                              content: (
                                <div>
                                  {item?.sub_account?.map(
                                    (subAccount: any, i: number) => {
                                      return (
                                        <div
                                          key={i}
                                          className="flex justify-between gap-6 w-full"
                                        >
                                          <p>{subAccount?.sub_account}</p>
                                          <div
                                            onClick={() => {
                                              if (props?.onDeleteSubAccount) {
                                                props?.onDeleteSubAccount({
                                                  main_account_id:
                                                    row?.original
                                                      ?.main_account_id,
                                                  cost_center_id:
                                                    item?.cost_center_id,
                                                  sub_account_id:
                                                    subAccount?.sub_account_id,
                                                });
                                              }
                                            }}
                                          >
                                            <Trash2 color="red" height={16} />
                                          </div>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              ),
                            },
                          ]}
                        />
                      );
                    })}
                  </div>
                ) : typeof value === "boolean" ? (
                  <p className="flex-1">
                    {value ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </p>
                ) : typeof value === "object" && value && value[0] ? (
                  <>
                    <p className="flex-1 overflow-ellipsis break-words">
                      {/* {(value as Array<any>).join(", ")} */}
                      <select
                        className="rounded-[12px] p-1 w-[70px]"
                        name="role"
                        disabled={selectDisable}
                        // value={roles[0]==="employee"?columnIndex -5:"ddd"}
                        onChange={(e) =>
                          handleChange(
                            columnIndex - 3,
                            value[e.target.selectedIndex - 1]
                          )
                        }
                        id=""
                      >
                        <option value="null">Select</option>
                        {value.map((item: any, index: any) => (
                          <option
                            key={index}
                            value={
                              typeof item === "object" ? item?.username : item
                            }
                          >
                            {typeof item === "object" ? item?.username : item}
                          </option>
                        ))}
                      </select>
                    </p>
                  </>
                ) : (
                  <p
                    className="flex-1 overflow-ellipsis break-words"
                    onClick={() => {
                      navigator.clipboard.writeText(value);
                      toast.success("Copied");
                    }}
                  >
                    {value}
                  </p>
                )}
              </div>
            );
          },
        })
      ),
      isMangerOrHr && props.tableKey !== "history" && pathName[2] == "cash"
        ? {
            id: "Req More",
            header: ({ table }: any) => (
              <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) =>
                  table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
              />
            ),
            cell: ({ row }: any) =>
              row?.original.reqMore != "yes" ? (
                <Button
                  onClick={() => {
                    setIsOpen(true), setDocId(row?.original?._id);
                  }}
                  style={{
                    backgroundColor: "grey",
                    color: "white",
                  }}
                >
                  Req More
                </Button>
              ) : (
                <Button
                  disabled={true}
                  style={{
                    backgroundColor: "#488c3f",
                    color: "white",
                  }}
                >
                  Req Sent
                </Button>
              ),
            enableSorting: false,
            enableHiding: false,
          }
        : null,
      isMangerOrHr && props.tableKey !== "history"
        ? {
            id: "Reject",
            header: ({ table }: any) => (
              <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) =>
                  table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
              />
            ),
            cell: ({ row }: any) => (
              <Button
                onClick={() => handleApprove(row.original._id, "reject")}
                style={{ backgroundColor: "#ce3535", color: "white" }}
              >
                Reject
              </Button>
            ),
            enableSorting: false,
            enableHiding: false,
          }
        : null,
      isMangerOrHr && props.tableKey !== "history"
        ? {
            id: "Approve",
            header: ({ table }: any) => (
              <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) =>
                  table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
              />
            ),
            cell: ({ row }: any) => (
              <Button
                style={{ backgroundColor: "green", color: "white" }}
                onClick={() => handleApprove(row.original._id, "accept")}
              >
                Approve
              </Button>
            ),
            enableSorting: false,
            enableHiding: false,
          }
        : null,
    ].filter(Boolean) as ColumnDef<any>[];
  }, [ props.accordion, role]);

  const table = useReactTable({
    data: props.data,
    columns: tableColums,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    meta: {
      onEdit: props.onEdit,
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: props.page,
        pageSize: props.limit,
      },
    },
  });
  console.log(props.data, ";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;");

  const [isFirstRender, setIsFirstRender] = React.useState(true)
	React.useEffect(() => {
    console.log("props.tableKeyprops.tableKeyprops.tableKey",props.tableKey)
		if (!isFirstRender) {
			localStorage.setItem(
				`${props.tableKey}ColumnVisibility`,
				JSON.stringify(columnVisibility),
			)
		} else {
			const savedVisibleColumn = localStorage.getItem(`${props.tableKey}ColumnVisibility`)

			console.log("🚀 ~ React.useEffect ~ savedVisibleColumn:", savedVisibleColumn)
			if (savedVisibleColumn) {
				setColumnVisibility(JSON.parse(savedVisibleColumn))
			} else {
				const initialVisibleColumns = () => {
					let hiddenColumns: Record<string, boolean> = {}
					console.log("🚀 ~ initialVisibleColumns ~ hiddenColumns:", hiddenColumns)
					for (let i = 0; i < props.columns.length; i++) {
						if (i < 8) {
							hiddenColumns[props.columns[i]] = true
						} else {
							hiddenColumns[props.columns[i]] = false
						}
					}
					return hiddenColumns
				}
				setColumnVisibility(initialVisibleColumns())
        console.log("columnVisibility after ",columnVisibility)
			}
			setIsFirstRender(false)
		}
	}, [columnVisibility, props.tableKey])
  return (
    <>
      <div className="flex items-center justify-between py-4">
        {isOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
              <div className="fixed inset-0 bg-black opacity-50"></div>
              <div className="z-20 w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <Cross1Icon />
                  </button>
                </div>
                <div className="mt-4">
                  <textarea
                    onChange={(e) => setNote(e.target.value)}
                    style={{
                      border: "2px solid black",
                      borderRadius: "10px",
                      padding: "10px",
                      marginBottom: "20px",
                    }}
                    name="note"
                    id="note"
                    placeholder="Enter your note"
                    cols={42}
                    rows={5}
                  ></textarea>
                  <div>
                    <Button
                      onClick={() => sendReqMore()}
                      style={{
                        backgroundColor: "grey",
                        color: "white",
                      }}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {requireFileModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
              <div className="fixed inset-0 bg-black opacity-50"></div>
              <div className="z-20 w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                <div className="flex justify-end">
                  <button
                    onClick={() => setRequireFileModal(false)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <Cross1Icon />
                  </button>
                </div>
                <div className="mt-4">
                  <p>
                    <span style={{ fontSize: "20px", fontWeight: "600" }}>
                      {" "}
                      Note:
                    </span>{" "}
                    {attachmentNote}
                  </p>

                  <input
                    className="my-2"
                    type="file"
                    onChange={(e: any) => setAttachmentFile(e.target.files[0])}
                  />
                  <div>
                    <Button
                      onClick={() => sendMoreFile()}
                      style={{
                        backgroundColor: "grey",
                        color: "white",
                      }}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* <DropdownMenu> */}
        {/* <DropdownMenuTrigger asChild> */}
        <Button variant="outline" className="">
          Entries: {props?.data?.length}
        </Button>
        {/* </DropdownMenuTrigger> */}
        {/* <DropdownMenuContent align="end">
            {PAGINATION_LIMIT.map((limit) => {
              return (
                <DropdownMenuItem
                  key={limit}
                  onClick={() => props.setLimit(limit)}
                >
                  {limit}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu> */}
        <div className="flex flex-wrap gap-4">
        {(() => {
						const selectedRows = table.getFilteredSelectedRowModel().rows
						console.log("🚀 ~ CommonTable ~ selectedRows:", selectedRows)
            console.log("props.columnsprops.columnsprops.columns",props.columns)

						if (selectedRows.length) {
							return (
								<>
									<Button
										variant={'destructive'}
										onClick={() => {
											console.log( "columnVisibilitycolumnVisibility",columnVisibility)
											const newArray = selectedRows?.map((row) => {
												const newRow: any = {}
												props.columns.forEach((column) => {
													if (columnVisibility[column]) {
														// let words = column.split(' ')

														// Capitalize the first letter of each word and join them with an underscore
														// const result: string = words
														// 	.map(
														// 		(word) =>
														// 			word.charAt(0).toUpperCase() +
														// 			word.slice(1),
														// 	)
														// 	.join(' ')

														let newWords = column.split('_')
														const newResult: string = newWords
															.map(
																(word) =>
																	word.charAt(0).toUpperCase() +
																	word.slice(1),
															)
															.join(' ')
														newRow[newResult] = row.original[column]
														console.log(column)
													}
												})
												return newRow
											})
                      console.log("newArraynewArraynewArray",newArray)
											exportJsonToExcel(newArray)
											// The newArray now contains the transformed data based on your code snippet
										}}>
										Export to XL ({selectedRows.length})
									</Button>
									{/* <Button
										variant={'destructive'}
										onClick={() => {
											props.onDeleteMany(
												selectedRows.map((row) => row.original._id),
											)
											setRowSelection({})
										}}>
										Delete ({selectedRows.length})
									</Button>
									{props?.customActionsComponents &&
										props?.customActionsComponents(
											selectedRows.map((row) => row.original._id),
										)} */}
								</>
							)
						} else {
							return null
						}
					})()}
          {props.onCreate && (
            <Button variant={"outline"} onClick={props.onCreate}>
              Create
            </Button>
          )}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id} colSpan={header.colSpan}>
											{header.isPlaceholder ? null : (
												<div
													{...{
														className: header.column.getCanSort()
															? 'cursor-pointer select-none flex items-center gap-1'
															: '',
														onClick:
															header.column.getToggleSortingHandler(),
													}}>
													{flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
													{{
														asc: <ChevronUp color="black" width={20} />,
														desc: <ChevronDown width={20} />,
													}[header.column.getIsSorted() as string] ??
														null}
												</div>
											)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
          </TableHeader>
          <TableBody>
            {props.loading ? (
              <TableRow>
                <TableCell
                  colSpan={props.columns.length}
                  className="h-24 w-[50px] text-center"
                >
                  <Loading
                    type="spin"
                    className="mx-auto"
                    width={20}
                    height={20}
                    color="#777"
                  />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, i) => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {props.attachment &&
                      row.getVisibleCells().map((cell) => {
                        console.log(cell, "cell ");
                        if (cell.column.id === "attachment") {
                          return (
                            <TableCell key={cell.id}>
                              {cell?.row?.original?.attachment &&
                              cell?.row?.original?.reqMore == "no" ? (
                                <a
                                  href={cell?.row?.original?.attachment}
                                  target="_blank"
                                  className="text-blue-500"
                                >
                                  Attachment
                                </a>
                              ) : pathName[2] === "cash" &&
                                localStorage.getItem("role") != "employee" ? (
                                <a
                                  href={cell?.row?.original?.attachment}
                                  target="_blank"
                                  className="text-blue-500"
                                >
                                  Attachment
                                </a>
                              ) : localStorage.getItem("role") === "employee" &&
                                pathName[2] === "cash" ? (
                                cell?.row?.original.reqMore == "no" ? (
                                  <a
                                    href={cell?.row?.original?.attachment}
                                    target="_blank"
                                    className="text-blue-500"
                                  >
                                    Attachment
                                  </a>
                                ) : (
                                  <Button
                                    onClick={() => {
                                      setRequireFileModal(true),
                                        setAttachmentNote(
                                          cell?.row?.original?.reqNote
                                        ),
                                        setDocId(cell?.row?.original?._id);
                                    }}
                                    style={{
                                      backgroundColor: "red",
                                      color: "white",
                                    }}
                                  >
                                    Add File
                                  </Button>
                                )
                              ) : (
                                <a
                                  href={cell?.row?.original?.attachment}
                                  target="_blank"
                                  className="text-blue-500"
                                >
                                  Attachment
                                </a>
                              )}
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}

                    {props.editIcon && (
                      <TableCell>
                        <FileEdit
                          onClick={() => props.onViewDetails(row.index)}
                          style={{
                            cursor: "pointer",
                          }}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={props.columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='mt-auto flex items-center justify-end space-x-2 py-4'>
				<div className='text-muted-foreground flex-1 text-sm'>
					{table.getFilteredSelectedRowModel().rows.length ? (
						<>
							{table.getFilteredSelectedRowModel().rows.length} of{' '}
							{table.getFilteredRowModel().rows.length} row(s) selected.
						</>
					) : (
						<>
							Showing {(props.page - 1) * props.limit + 1}-
							{(props.page - 1) * props.limit + props.data.length} of{' '}
							{props.totalDocuments} Documents
						</>
					)}
				</div>
				<div className='space-x-2'>
					<Button
						variant='outline'
						size='sm'
						onClick={() => props.setPage(1)}
						disabled={props.page === 1}
						title='First Page'>
						<ChevronsLeft />
					</Button>
					<Button
						variant='outline'
						size='sm'
						onClick={() => props.setPage(props.page - 1)}
						disabled={props.page === 1}
						title='Previous Page'>
						<ChevronLeft />
					</Button>
					<Button
						variant='outline'
						size='sm'
						onClick={() => props.setPage(props.page + 1)}
						disabled={props.page === props.lastPage}
						title='Next Page'>
						<ChevronRight />
					</Button>
					<Button
						variant='outline'
						size='sm'
						onClick={() => props.setPage(props.lastPage)}
						disabled={props.page === props.lastPage}
						title='Last Page'>
						<ChevronsRight />
					</Button>
				</div>
			</div>
    </>
  );
}

const ActionDropdown = (
  props: Pick<
    CommonTableProps,
    | "hideRowActions"
    | "onViewDetails"
    | "tableKey"
    | "onDuplicate"
    | "fieldsToCopy"
  > &
    Pick<CellContext<any, any>, "row">
) => {
  function getRandomNumber() {
    const randomNumber = Math.floor(Math.random() * 10000) + 1;

    return randomNumber;
  }
  const dropdownItems: Array<{
    key: (typeof commonTableRowActions)[number];
    item: React.ReactNode;
  }> = [
    {
      key: "view_details",
      item: (
        <DropdownMenuItem onClick={() => props.onViewDetails(props.row.index)}>
          View Details
        </DropdownMenuItem>
      ),
    },
    {
      key: "copy_details",
      item: (
        <DropdownMenuItem
          onClick={() => {
            if (props?.fieldsToCopy?.length) {
              let objectToCopy: Record<string, any> = {};
              props.fieldsToCopy.forEach((field) => {
                objectToCopy[field] = props.row.original[field];
              });
              copyObjectToClipBoard(objectToCopy);
              toast.success("Copied Details");
            } else {
              copyObjectToClipBoard(props.row.original);
              toast.success("Copied Details");
            }
          }}
        >
          Copy Details as Text
        </DropdownMenuItem>
      ),
    },
    {
      key: "duplicate",
      item: (
        <DropdownMenuItem
          onClick={() => {
            const { _id, invoice_number, sr_no, ...newObj } =
              props.row.original;
            const updatedInvoice = getRandomNumber();
            const updatedSrNo = getRandomNumber();
            const newObject = {
              ...newObj,
              invoice_number: updatedInvoice,
              sr_no: updatedSrNo,
            };
            if (props?.onDuplicate) {
              props.onDuplicate(newObject);
            }
          }}
        >
          Duplicate
        </DropdownMenuItem>
      ),
    },
    {
      key: "create_invoice",
      item: (
        <DropdownMenuItem>
          <a
            href={`${env.NEXT_PUBLIC_API_URL}/invoice/${props.tableKey}/${props.row.original._id}`}
            target="_blank"
          >
            Create Invoice
          </a>
        </DropdownMenuItem>
      ),
    },
    {
      key: "create_voucher",
      item: (
        <DropdownMenuItem>
          <a
            href={`${env.NEXT_PUBLIC_API_URL}/voucher/${props.tableKey}/${props.row.original._id}`}
            target="_blank"
          >
            Create Voucher
          </a>
        </DropdownMenuItem>
      ),
    },
  ];

  return (
    <>
      {dropdownItems.map((item) => {
        if (props.hideRowActions && props.hideRowActions.includes(item.key)) {
          return null;
        } else {
          return <React.Fragment key={item.key}>{item.item}</React.Fragment>;
        }
      })}
    </>
  );
};
