import axios, { AxiosRequestConfig } from 'axios'

import { env } from './env'
import { HttpError } from '@/lib/interfaces'

export const httpClient = axios.create({
	baseURL: `${env.NEXT_PUBLIC_API_URL}`,
})

class Http {
	constructor() {}

	private async send<T>(
		type: 'get' | 'post' | 'put' | 'patch' | 'delete',
		url: string,
		data?: any | undefined,
		config?: AxiosRequestConfig,
	): Promise<T & HttpError> {
		if (['get', 'delete'].includes(type)) {
			return (await httpClient[type](url, config)).data as Promise<T & HttpError>
		}
		return (await httpClient[type](url, data, config)).data as Promise<T & HttpError>
	}

	get<T>(url: string, config?: AxiosRequestConfig) {
		return this.send<T>('get', url, {}, config)
	}
	post<T>(url: string, data: any, config?: AxiosRequestConfig) {
		return this.send<T>('post', url, data, config)
	}
	put<T>(url: string, data: any, config?: AxiosRequestConfig) {
		return this.send<T>('put', url, data, config)
	}
	patch<T>(url: string, data: any, config?: AxiosRequestConfig) {
		return this.send<T>('patch', url, data, config)
	}
	delete<T>(url: string, config?: AxiosRequestConfig) {
		return this.send<T>('delete', url, {}, config)
	}
}

export const http = new Http()
