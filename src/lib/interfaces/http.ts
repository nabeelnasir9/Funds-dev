export interface HttpError {
  data: any
	status: number
	message: string
}

export interface HttpCommonResponse {
	message: string
	status: number
	error?: boolean
	error_list?: string[]
}

export interface Pagination {
	page: number
	limit: number
	last_page: number
	total_count: number
}

export interface CommonGetAllResponse extends HttpCommonResponse {
	pagination: Pagination
}
