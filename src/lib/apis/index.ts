export const apiUrls = {
  users: {
    login: "api/auth/login",
    create: "api/auth/create_user",
    me: "api/auth/get_me",
    getAll: "api/auth/get_users",
    update: "api/auth/update_user",
    upload: "api/auth/upload",
    deleteMultiple: "api/auth/delete_users",
    addCashRequest: "api/cash/addCashRequest",
    getCashRequest: "api/cash/getCashHistory",
    addLeaveRequest: "api/leaves/addLeaveRequest",
    getLeaveRequest: "api/leaves/getLeaves",
    addPassoutRequest: "api/passout/addPassoutRequest",
    getPassoutRequest: "api/passout/getPassoutRequest",

    approveRequest:"api/approveRequest"
  }
}