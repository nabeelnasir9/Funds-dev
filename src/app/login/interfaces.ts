import { HttpCommonResponse } from '@/lib/interfaces'

export interface UserLogin {
	email: string
	password: string
}

export interface LoginResponse extends HttpCommonResponse {
	access_token: string
}
