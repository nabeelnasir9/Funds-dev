export const apiUrls = {
  users: {
    login: "api/auth/login",
    create: "api/auth/create_user",
    me: "api/users/getUser",
    getAll: "api/users/getAllUser",
    update: "api/auth/update_user",
    upload: "api/auth/upload",
    deleteMultiple: "api/auth/delete_users",
    addCashRequest: "api/cash/addCashRequest",
    getCashRequest: "api/cash/getCashHistory",
    addLeaveRequest: "api/leaves/addLeaveRequest",
    getLeaveRequest: "api/leaves/getLeaves",
    addPassoutRequest: "api/passout/addPassoutRequest",
    getPassoutRequest: "api/passout/getPassoutRequest",
    addInvoiceRequest: "api/invoices/addInvoiceRequest",
    getInvoiceRequest: "api/invoices/getInvoiceRequest",
    addReqMore: "api/reqMore/sendReqMore",
    addMoreFile: "api/reqMore/addMoreFile",
    downloadExcel: "api/downloadExcel",
    approveRequest: "api/approveRequest",
    updatePassword: "api/users/updatePassword",
  },
};
