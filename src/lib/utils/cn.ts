import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * `cn()` function merges the tailwind classes in a predictable way
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const debounce = (func: (...args: any[]) => void, delay: number) => {
	let timeoutId: NodeJS.Timeout

	return function (this: any, ...args: any[]) {
		clearTimeout(timeoutId)

		timeoutId = setTimeout(() => {
			func.apply(this, args)
		}, delay)
	}
}
