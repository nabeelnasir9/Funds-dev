import * as React from "react";
import { ChevronDownIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
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
  // exportJsonToExcel,
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
};

export type TableMeta = Pick<CommonTableProps, "onEdit">;

export function CommonTable(props: CommonTableProps) {
  const pathname = usePathname();
  let pathName = pathname.split("/");

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [roles, setRoles] = React.useState<any>(Array(3).fill("")); // Array of role states
  const handleChange = async (index: any, value: any) => {
    let valuesFromStorage = await localStorage.getItem("rolesArray");
    let val = JSON.parse(valuesFromStorage);
    console.log(val, "-------valueas", index);

    if ((val[0] === "hr" || val[0] === "manager") && index != 0) {
      toast.success("no need of HR or Manager");
      setSelectDisable(true);
      await localStorage.setItem("rolesArray",JSON.stringify(roles));

      return;
    }
    console.log(index, "------------sent in func", value);
    setRoles((prevArray: any) => {
      const newArray = [...prevArray];
      newArray[index] = value; // Update the first element
      console.log(newArray, "-------------÷÷----------noew role before");
      return newArray;
    });
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
  const handleApprove = async (id: any, status: any) => {
    try {
      toast.loading("loading");
      let userToken = await localStorage.getItem("token");
      let role = await localStorage.getItem("role");
      let rolesArray: any = await localStorage.getItem("rolesArray");
      let val=JSON.parse(rolesArray)
      if (val[0] === "hr" || val[0] === "manager") {
        val[1]="",
        val[2]=""
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
        if (role === "manager") {
          let approvedDoc;
          let updatedTableDate: any = props.tableData.filter(
            (item: any, i: any) => {
              if (item._id !== id) {
                return item;
              } else {
                if (status == "reject") {
                  approvedDoc = {
                    ...item,
                    mangerApprove: status,
                    status: status,
                  };
                } else {
                  approvedDoc = {
                    ...item,
                    mangerApprove: status,
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
        cell: ({ row }: any) => {
          console.log(
            row.id,
            "----------------------------------------------------------------------------------"
          );
          return <p>{+row.id + 1}</p>;
        },
        enableSorting: false,
        enableHiding: false,
      },
      ...[...props.columns, ...(props?.accordion ?? [])].map(
        (column, columnIndex) => ({
          accessorKey: column,
          header: <p className="capitalize">{snakeCaseToNormal(column)}</p>,

          // @ts-ignore
          cell: ({ row }) => {
            const value = row.getValue(column);
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
                                <div className="flex justify-between gap-8 w-full">
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
                                          className="flex justify-between gap-8 w-full"
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
                        className="rounded-[12px] p-1"
                        name="role"
                        disabled={selectDisable}
                        // value={roles[0]==="employee"?columnIndex -5:"ddd"}
                        onChange={(e) =>
                          handleChange(
                            columnIndex - 5,
                            value[e.target.selectedIndex - 1]
                          )
                        }
                        id=""
                      >
                        <option  value="null">Select</option>
                        {value.map((item: any, index: any) => (
                          <option
                            key={index}
                            value={
                              typeof item === "object" ? item.username : item
                            }
                          >
                            {typeof item === "object" ? item.username : item}
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
                style={{ backgroundColor: "#488c3f", color: "white" }}
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
  }, [props.columns, props.accordion, role]);

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

  return (
    <>
      <div className="flex items-center justify-between py-4">
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
            {props.cashRequest?.map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div>{header.columnDef.header}</div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {props.loading ? (
              <TableRow>
                <TableCell
                  colSpan={props.columns.length}
                  className="h-24 text-center"
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
              table.getRowModel().rows.map((row) => {
                console.log(row, "table row", table.getRowModel().rows);
                return (
                  <TableRow
                    key={row.id}
                    // data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => {
                      console.log(cell, "cell==========");

                      return (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
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
