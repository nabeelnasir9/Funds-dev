import { snakeCaseToNormal } from './snakeCaseToNormal'

/**
 * `copyObjectToClipBoard()` function writes contents of an object to the clipboard.
 * @example
 * {a: "value1", var_2: "value2", var3: "value3"} would be written as
 * A = value1
 * Var 2 = value2
 * Var 3 = value3
 * @param {Record<string, any>} obj
 */
export function copyObjectToClipBoard(obj: Record<string, any>): void {
	let text = ''
	Object.entries(obj).forEach(([key, value]) => {
		text += snakeCaseToNormal(key, { capitalize: true })
		if (typeof value === 'boolean') {
			text += ` = ${value ? 'yes' : 'no'}\n`
		} else if (!value) {
			text += ' = <empty>\n'
		} else if (typeof value === 'object' && typeof value.length === 'number') {
			if (value.length) {
				text += ' = \n'
				;(value as Array<any>).forEach((value) => {
					text += `${value},\n`
				})
			} else {
				text += ' = <no data>\n'
			}
		} else {
			text += ` = ${value}\n`
		}
	})
	navigator.clipboard.writeText(text)
}

export const copyArrayOfStringsToClipBoard = (arr: string[]) => {
	let text = ''
	arr.forEach((value) => {
		text += `${value}\n`
	})
	navigator.clipboard.writeText(text)
}
