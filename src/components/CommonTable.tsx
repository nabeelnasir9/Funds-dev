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
};

export type TableMeta = Pick<CommonTableProps, "onEdit">;

export function CommonTable(props: CommonTableProps) {
  const pathname = usePathname();
  let pathName = pathname.split("/");

  console.log(pathname, "pathname===================", pathName[2]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
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
  const handleApprove = async (id, status) => {
    try {
      toast.loading("loading");
      let userToken = await localStorage.getItem("token");
      let role = await localStorage.getItem("role");
      let bodyData = {
        token: userToken,
        userRole: role,
        requestType: pathName[2],
        status,
        docId: id,
      };
      console.log("response", bodyData);
      let res = await http.post(apiUrls.users.approveRequest, bodyData);
      console.log(res, "-------------------------");

      if (res.message === "success") {
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
    let r = localStorage.getItem("role");
    setRole(r);
  }, []);
  const [role, setRole] = React.useState("employee");

  const tableColums = React.useMemo(() => {
    const isMangerOrHr = role !== "employee"; // Check if the role is admin
    return [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      ...[...props.columns, ...(props?.accordion ?? [])].map((column) => ({
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
                <p className="flex-1 overflow-ellipsis break-words">
                  {(value as Array<any>).join(", ")}
                </p>
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
      })),
      isMangerOrHr
        ? {
            id: "Reject",
            header: ({ table }) => (
              <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) =>
                  table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
              />
            ),
            cell: ({ row }) => (
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
      isMangerOrHr
        ? {
            id: "Approve",
            header: ({ table }) => (
              <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) =>
                  table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
              />
            ),
            cell: ({ row }) => (
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="">
              Entries: {props.limit}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
        </DropdownMenu>
        <div className="flex flex-wrap gap-4">
          {(() => {
            const selectedRows = table.getFilteredSelectedRowModel().rows;

            if (selectedRows.length) {
              return (
                <>
                  <Button
                    variant={"destructive"}
                    onClick={() => {
                      // console.log(table.getRowModel().rows, columnVisibility)
                      const newArray = selectedRows?.map((row) => {
                        const newRow: any = {};
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

                            let newWords = column.split("_");
                            const newResult: string = newWords
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ");
                            newRow[newResult] = row.original[column];
                            console.log(column);
                          }
                        });
                        return newRow;
                      });
                      exportJsonToExcel(newArray);
                      // The newArray now contains the transformed data based on your code snippet
                    }}
                  >
                    Export to XL ({selectedRows.length})
                  </Button>
                  <Button
                    variant={"destructive"}
                    onClick={() => {
                      props.onDeleteMany(
                        selectedRows.map((row) => row.original._id)
                      );
                      setRowSelection({});
                    }}
                  >
                    Delete ({selectedRows.length})
                  </Button>
                  {props?.customActionsComponents &&
                    props?.customActionsComponents(
                      selectedRows.map((row) => row.original._id)
                    )}
                </>
              );
            } else {
              return null;
            }
          })()}
          {props?.onUpload && <UploadData onSubmit={props.onUpload} />}
          <DropdownMenu></DropdownMenu>
          {props?.actions &&
            props?.actions.map((action, i) => {
              return (
                <Button variant={"outline"} onClick={action.onClick} key={i}>
                  {action.label}
                </Button>
              );
            })}

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
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div
                        // {...{
                        //   className: header.column.getCanSort()
                        //     ? "cursor-pointer select-none flex items-center gap-1"
                        //     : "",
                        //   // onClick: header.column.getToggleSortingHandler(),
                        // }}
                        >
                          {header.columnDef.header}

                          {/* {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )} */}
                          {/* {{
                            asc: <ChevronUp width={20} />,
                            desc: <ChevronDown width={20} />,
                          }[header.column.getIsSorted() as string] ?? null} */}
                        </div>
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
      <div className="mt-auto flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length ? (
            <>
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </>
          ) : (
            <>
              Showing {(props.page - 1) * props.limit + 1}-
              {(props.page - 1) * props.limit + props?.data?.length} of{" "}
              {props.totalDocuments} Documents
            </>
          )}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => props.setPage(1)}
            disabled={props.page === 1}
            title="First Page"
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => props.setPage(props.page - 1)}
            disabled={props.page === 1}
            title="Previous Page"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => props.setPage(props.page + 1)}
            disabled={props.page === props.lastPage}
            title="Next Page"
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => props.setPage(props.lastPage)}
            disabled={props.page === props.lastPage}
            title="Last Page"
          >
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
