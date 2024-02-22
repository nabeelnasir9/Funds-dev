import { ExtendedForm } from '@/lib/interfaces'

/**
 * `multiLineEvaluate()` evaluates multi-lines arithmetic expressions separated by ";" like:
 * @example
 * "a = (var1 * var2 * var3) - var4; b = (var5 * a); c = (a + b) * var6; return = a + b + c"
 *
 * @description
 * - **---- Rules ----*
 * - Each line (except last) must end with semi-colon i.e. ";"
 * - Name of the variable (except return) must start with an underscore i.e. "_" (to avoid conflicts with base data object's keys)
 * - The structure of the line must be "variable = expression". These 3 elements are required
 * - The expected return value must be named as "return" in the last line
 *
 * @param {string} expression
 * @param {Record<string, any>} dataObj
 * @returns {number}
 */
function multiLineEvaluate(expression: string, dataObj: Record<string, any>): number {
	if (expression?.includes?.('===')) {
		const codeToExecute = expression.split('return =')?.[1]
		return executeCode(codeToExecute, dataObj) ?? 0
	}
	let calculations: Record<string, number> = {}
	// Separating multiple expressions
	let expressions = expression.replace(/\n|\t/g, '').split(';')
	for (let str of expressions) {
		const key = str.substring(0, str.indexOf('=')).trim()
		let exp = str.substring(str.indexOf('=') + 1).trim()
		exp = replaceKeyWithValue({ ...dataObj, ...calculations }, exp)
		let res = arithmeticEvaluate(exp)
		calculations[key] = res
	}
	return calculations['return'] ?? 0
}

/**
 * `arithmeticEvaluate` evaluates arithmetic expressions in the form of strings (e.g. "8 * ( 4 + 5 )")
 * @param {string} expression
 * @returns {number}
 */
function arithmeticEvaluate(expression: string): number {
	const operators: Record<string, string[]> = {
		'+': ['+'],
		'-': ['-'],
		'*': ['*', '**'],
		'/': ['/', '//'],
	}

	const OPERATIONS: Record<string, (a: number, b: number) => number> = {
		'+': (a: number, b: number): number => a + b,
		'-': (a: number, b: number): number => a - b,
		'*': (a: number, b: number): number => a * b,
		'/': (a: number, b: number): number => a / b,
		'**': (a: number, b: number): number => Math.pow(a, b),
		'//': (a: number, b: number): number => Math.floor(a / b),
	}
	// tokenize
	let i = -1
	const tokens = []
	let token = ''
	while (++i < expression.length) {
		const ch = expression[i]
		if (ch == ' ') continue

		if (ch === '(') {
			let innerExpression = ''
			let innerBrackets = 0
			while (expression[++i] !== ')' || innerBrackets !== 0) {
				innerExpression += expression[i]

				if (expression[i] === '(') innerBrackets++
				if (expression[i] === ')') innerBrackets--

				if (i >= expression.length) {
					throw Error('Closing brackets are missing')
				}
			}

			if (innerExpression.length) {
				const value = arithmeticEvaluate(innerExpression)
				token = String(value)
			}
		} else if (operators[ch] && token.length) {
			const ops = operators[ch]
			tokens.push(token)
			token = ''
			if (ops.length > 1) {
				// process longer operators
				let op = ch
				while (ops.includes(op + expression[i + 1])) {
					op += expression[++i]
				}
				tokens.push(op)
			} else {
				tokens.push(ch)
			}
		} else {
			token += ch
		}
	}
	tokens.push(token)

	// calculate
	let result = 0

	const calculate = (tokens: string[], predicate: (s: string) => boolean) => {
		i = 0
		while (i + 1 < tokens.length) {
			const value1 = tokens[i]
			const op = tokens[i + 1]
			const value2 = tokens[i + 2]

			if (predicate(op)) {
				result = OPERATIONS[op](parseFloat(value1), parseFloat(value2))
				tokens.splice(i, 3, String(result))
			} else {
				i += 2
			}
		}
	}

	// calculate top priority operations
	calculate(tokens, (op) => op !== '-' && op !== '+')
	calculate(tokens, (op) => op === '-' || op === '+')

	return result
}

/**
 * `replaceKeyWithValue` function inserts values of the keys in a string expression
 * @param {Record<string, any>} obj
 * @param {string} expression
 * @returns {string}
 */
function replaceKeyWithValue(obj: Record<string, any>, expression: string): string {
	Object.entries(obj).forEach(([key, value]) => {
		if (expression.includes(key)) {
			expression = expression.replace(key, value)
		}
	})
	return expression
}

/**
 * `getDependencyArray` function returns all keys in a stringified expression.
 * For example: for an expression "value_1 * ( value_2 + value_3 )" it will return ["value_1", "value_2", "value_3"]
 * @param {ExtendedForm<any>} form
 * @param {expression} expression
 * @returns {string[]}
 */
function getDependencyArray(form: ExtendedForm<any>, expression: string): string[] {
	let returnArr: string[] = []
	form.forEach((group) => {
		group.fields.forEach((field) => {
			if (field.type === 'heading') return
			if (expression.includes(field.key as string)) {
				returnArr.push(field.key as string)
			}
		})
	})
	return returnArr
}

/**
 * `checkFields` function checks specified fields of an object to truthy. if any of the specified keys has
 * falsy value, it return false
 * @param {Record<string, any>} obj
 * @param {string[] } fields
 * @returns {boolean}
 */
function checkFields(obj: Record<string, any>, fields: string[]): boolean {
	for (let field of fields) {
		if (!obj[field]) return false
	}
	return true
}

function executeCode(code: string, variables: Record<string, any>) {
	try {
		const variableNames = Object.keys(variables)
		const variableValues = Object.values(variables)
		const fn = Function(...variableNames, `return ${code}`)
		const result = fn(...variableValues)

		return result
	} catch (error) {
		console.error('Error executing code:', error)
		return null
	}
}

export const fieldCalculation = {
	replaceKeyWithValue,
	getDependencyArray,
	checkFields,
	arithmeticEvaluate,
	multiLineEvaluate,
	executeCode,
}
