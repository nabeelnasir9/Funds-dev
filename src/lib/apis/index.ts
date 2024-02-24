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
  },
  hotels: {
    create: "hotels/add_hotels",
    getAll: "hotels/get_hotels",
    getOne: "hotels/get_hotel_by_id",
    deleteMultiple: "hotels/delete_hotels",
    upload: "hotels/upload",
    updateOne: "hotels/update_hotel_by_id",
    updateHotels: "hotels/update_hotels",
  },
  umrahs: {
    create: "umrahs",
    getAll: "umrahs",
    getOne: "umrahs",
    updateOne: "umrahs",
    upload: "umrahs/upload",
    deleteMultiple: "umrahs/delete_umrahs",
  },
  transportations: {
    create: "transportations/add_transportations",
    getAll: "transportations/get_transportations",
    getOne: "transportations/get_transportation_by_id",
    updateOne: "transportations/update_transportation_by_id",
    upload: "transportations/upload",
    deleteMultiple: "transportations/delete_transportations",
  },
  clients: {
    create: "/client_details/add_client_details",
    getAll: "/client_details/get_all_client_details",
    getOne: "/client_details/get_client_details_by_id",
    updateOne: "/client_details/update_client_details_by_id",
    upload: "clients/upload",
    deleteMultiple: "client_details/delete_multi_client_details_by_id",
    getBySr: "/client_details/get_client_details_by_sr",
  },
  vendors: {
    create: "/vendor_details/add_vendor_details",
    getAll: "/vendor_details/get_all_vendor_details",
    getOne: "/vendor_details/get_vendor_details_by_id",
    updateOne: "/vendor_details/update_vendor_details_by_id",
    upload: "vendors/upload",
    deleteMultiple: "/vendor_details/delete_multi_vendor_details_by_id",
  },

  hotel: {
    create: "/api/hotel_details/add_hotel_details",
    getAll: "/api/hotel_details/get_all_hotel_details",
    getOne: "/api/hotel_details/get_hotel_details_by_id",
    updateOne: "/api/hotel_details/update_hotel_details_by_id",
    upload: "/apihotels/upload",
    deleteOne: "/api/hotel_details/delete_hotel_details_by_id",
    deleteMultiple: "/api/hotel_details/delete_multiple_hotel_details_by_id",
  },

  transportation: {
    create: "/api/transportation_details/add_transportation_details",
    getAll: "/api/transportation_details/get_all_transportation_details",
    getOne: "/api/transportation_details/get_transportation_details_by_id",
    updateOne:
      "/api/transportation_details/update_transportation_details_by_id",
    upload: "/api/transportations/upload",
    deleteOne:
      "/api/transportation_details/delete_transportation_details_by_id",
    deleteMultiple:
      "/api/transportation_details/delete_multiple_transportation_details_by_id",
  },

  roomType: {
    create: "/api/room_type_details/add_room_type_details",
    getAll: "/api/room_type_details/get_all_room_type_details",
    getOne: "/api/room_type_details/get_room_type_details_by_id",
    updateOne: "/api/room_type_details/update_room_type_details_by_id",
    upload: "/api/room_types/upload",
    deleteOne: "/api/room_type_details/delete_room_type_details_by_id",
    deleteMultiple:
      "/api/room_type_details/delete_multiple_room_type_details_by_id",
  },

  mealPlan: {
    create: "/api/meal_plan_details/add_meal_plan_details",
    getAll: "/api/meal_plan_details/get_all_meal_plan_details",
    getOne: "/api/meal_plan_details/get_meal_plan_details_by_id",
    updateOne: "/api/meal_plan_details/update_meal_plan_details_by_id",
    upload: "/api/meal_plans/upload",
    deleteOne: "/api/meal_plan_details/delete_meal_plan_details_by_id",
    deleteMultiple:
      "/api/meal_plan_details/delete_multiple_meal_plan_details_by_id",
  },

  reservationStatus: {
    create: "/api/reservation_status_details/add_reservation_status_details",
    getAll:
      "/api/reservation_status_details/get_all_reservation_status_details",
    getOne:
      "/api/reservation_status_details/get_reservation_status_details_by_id",
    updateOne:
      "/api/reservation_status_details/update_reservation_status_details_by_id",
    upload: "/api/reservation_statuses/upload",
    deleteOne:
      "/api/reservation_status_details/delete_reservation_status_details_by_id",
    deleteMultiple:
      "/api/reservation_status_details/delete_multiple_reservation_status_details_by_id",
  },

  employees: {
    create: "/api/employee_details/add_employee_details",
    getAll: "/api/employee_details/get_all_employee_details",
    getOne: "/api/employee_details/get_employee_details_by_id",
    updateOne: "/api/employee_details/update_employee_details_by_id",
    upload: "/api/employee_details/upload",
    deleteOne: "/api/employee_details/delete_employee_details_by_id",
    deleteMultiple:
      "/api/employee_details/delete_multiple_employee_details_by_id",
  },

  nationality: {
    create: "/api/nationality/add_nationality",
    getAll: "/api/nationality/get_all_nationality",
    getOne: "/api/nationality/get_nationality_by_id",
    updateOne: "/api/nationality/update_nationality_by_id",
    upload: "/api/employee_details/upload",
    deleteOne: "/api/nationality/delete_nationality_by_id",
    deleteMultiple: "/api/nationality/delete_multiple_nationality_by_id",
  },

  roomView: {
    create: "/api/room_view_details/add_room_view_details",
    getAll: "/api/room_view_details/get_all_room_view_details",
    getOne: "/api/room_view_details/get_room_view_details_by_id",
    updateOne: "/api/room_view_details/update_room_view_details_by_id",
    upload: "/api/room_view_details/upload",
    deleteOne: "/api/room_view_details/delete_room_view_details_by_id",
    deleteMultiple:
      "/api/room_view_details/delete_multiple_room_view_details_by_id",
  },
  transactionCode: {
    create: "/api/transaction_code/add_transaction_code",
    getAll: "/api/transaction_code/get_all_transaction_code",
    getOne: "/api/transaction_code/get_transaction_code_by_id",
    updateOne: "/api/transaction_code/update_transaction_code_by_id",
    deleteOne: "/api/transaction_code/delete_transaction_code_by_id",
    deleteMultiple:
      "/api/transaction_code/delete_multiple_transaction_code_by_id",
    upload: "/api/transaction_code/upload",
  },
  mainAccount: {
    create: "/add_main_account",
    getAll: "/get_main_account",
    // getOne: '/api/main_account/get_main_account_by_id',
    // updateOne: '/api/main_account/update_main_account_by_id',
    deleteOne: "/delete_main_account",
  },
  costCenter: {
    create: "/add_cost_center",
    // getOne: '/api/main_account/get_main_account_by_id',
    // updateOne: '/api/main_account/update_main_account_by_id',
    deleteOne: "/delete_cost_center",
  },
  subAccount: {
    create: "/add_sub_account",
    // getOne: '/api/main_account/get_main_account_by_id',
    // updateOne: '/api/main_account/update_main_account_by_id',
    deleteOne: "/delete_sub_account",
  },
  transaction: {
    create: "/finance/vouchers/add",
    getAll: "/finance/vouchers/get_all",
    updateOne: "/finance/vouchers/update",
    deleteOne: "/finance/vouchers/delete",
    deleteMultiple: "/finance/vouchers/delete_multiple",
  },
};
