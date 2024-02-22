'use client'

import { useState, useMemo, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
// import { getSearchQueryObject, generateSearchQueryStr } from '@/lib/utils'
import useStore from '@/lib/store'

type ISearchQueryValue = string | number | boolean

type ISearchFilter = Record<string, ISearchQueryValue>

type ISearchSelect = string

type ISearchQuery = {
	filter: ISearchFilter
	select: ISearchSelect[]
	page: number
	limit: number
	[key: string]: any
}

export function useSearchQuery() {
	const router = useRouter()
	const store = useStore()

	const { queryObj: existingQuery, queryStr: existingQueryStr } = parseSearchQueryStr(store.url)
	const [state, setState] = useState<ISearchQuery>({
		filter: existingQuery ? existingQuery.filter : {},
		select: existingQuery ? existingQuery.select : [],
		page: existingQuery && existingQuery.page ? existingQuery.page : 1,
		limit: existingQuery && existingQuery.limit ? existingQuery.limit : 100,
	})
	// const queryStr = useMemo(
	// 	() => generateSearchQueryStr({ filter: setFilterParams(filterObj) }),
	// 	[filterObj],
	// )
	const queryStr = useMemo(() => generateSearchQueryStr(state), [state])
	// const queryStr = ""

	useEffect(() => {
		router.push(queryStr)
	}, [queryStr])

	function setQuery(object: Record<string, string | number | boolean>) {
		setState((prev) => ({ ...prev, filter: object }))
		router.push(generateSearchQueryStr({ ...state, filter: object }))
	}

	function setPage(page: number): void {
		setState((prev) => ({ ...prev, page }))
	}

	function setLimit(limit: number): void {
		setState((prev) => ({ ...prev, limit }))
	}

	return {
		queryStr,
		filterObj: state.filter,
		selectArr: state.select,
		pagination: {
			page: state.page,
			limit: state.limit,
		},
		setQuery,
		setPage,
		setLimit,
	}
}

/**
 * `generateSearchQueryStr()` function generates a query string of given object
 * @example
 * -> turns {filter: {key1: value1, key2: value2}} to 'filter=key1,value1,key2,value2'
 * -> turns {select: [value1, value2]} to 'select=value1,value2'
 * -> turns {[key: any]: any} to 'key=value'
 * -> combines above results into return string
 * @param {ISearchQuery} object
 * @returns
 */
function generateSearchQueryStr(object: ISearchQuery): string {
	let returnString = ''
	Object.entries(object).forEach(([key, value], i) => {
		if (i !== 0 && !returnString.endsWith('&')) returnString += '&'
		if (['filter', 'select'].includes(key)) {
			if (key === 'filter') {
				if (value && Object.keys(value).length) {
					returnString += 'filter='
					Object.entries(value).forEach(([key, value]) => {
						returnString += `${key},${value},`
					})
				}
			} else if (key === 'select') {
				if (value && value.length) {
					returnString += 'select='
					for (let item of value) {
						if (value) returnString += `${item},`
					}
				}
			}
			returnString = returnString.slice(0, -1)
		} else {
			returnString += `${key}=${value}`
		}
	})
	if (returnString.startsWith('&')) returnString = returnString.substring(1)
	return returnString.length ? '?' + returnString : returnString
}

/**
 * `parseSearchQueryStr()` function parses a query string to an object. if no input given then
 * it parses `window.location.href` by default
 * @example
 * -> turns 'filter=key1,value1,key2,value2' to {filter: {key1: value1, key2: value2}}
 * -> turns 'select=value1,value2' to {select: [value1, value2]}
 * -> turns 'key=value' to {[key: string]: any}
 * -> combines above results into return object
 * @param {string} queryString
 * @returns
 */
function parseSearchQueryStr(queryString?: string | null): {
	queryObj: ISearchQuery | null
	queryStr: string
} {
	'use client'
	if (!queryString) {
		if (typeof window !== 'undefined' && window.location.href.indexOf('?') !== -1) {
			queryString = window.location.href
		} else {
			return {
				queryObj: null,
				queryStr: '',
			}
		}
	}

	if (queryString.indexOf('?') === 1) {
		return {
			queryObj: null,
			queryStr: '',
		}
	}

	queryString = queryString.substring(queryString.indexOf('?') + 1)

	const queryArr = queryString.split('&').filter((v) => Boolean(v))
	let returnObj: any = {}
	queryArr.forEach((query) => {
		const [key, value] = query.split('=')
		if (['filter', 'select'].includes(key)) {
			if (key === 'filter') {
				let tempFilterObj: any = {}
				let valueArr = value.split(',')
				for (let i = 0; i < valueArr.length; i += 2) {
					tempFilterObj[valueArr[i]] = transformValue(valueArr[i + 1])
				}
				returnObj.filter = tempFilterObj
			} else if (key === 'select') {
				returnObj.select = value.split(',')
			}
		} else {
			returnObj[key] = transformValue(value)
		}
	})

	if (!queryArr.length) {
		return {
			queryObj: null,
			queryStr: '',
		}
	}
	return {
		queryObj: returnObj,
		queryStr: '?' + queryString,
	}
}

/**
 * `transformValue()` converts a string to appropriate value like number, boolean or string
 * @example
 * -> converts 'true'/'false' to true/false
 * -> converts '123' and '1.23' to 123 & 1.23 respectively
 * -> just returns other strings as is
 * @param {string} anyValue
 * @returns
 */
export function transformValue(anyValue: string) {
	if (Number(anyValue)) return Number(anyValue)
	if (['true', 'false'].includes(anyValue)) {
		return anyValue === 'true' ? true : false
	}
	return anyValue
}
