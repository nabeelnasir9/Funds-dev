type SnakeCaseToNormalOptions = {
	capitalize: boolean
}

const defaultOptions: SnakeCaseToNormalOptions = {
	capitalize: false,
}

/**
 * `snakeCaseToNormal()` converts both snake case & camel case strings into normal strings
 * @param {string} variable
 * @returns {string}
 */
export function snakeCaseToNormal(
	variable: string,
	options: SnakeCaseToNormalOptions = defaultOptions,
): string {
	let returnVal = variable
		.replace(/([a-z])([A-Z])/g, '$1 $2') // converts camel case to normal
		.replace(/_/g, ' ') // converts snake case to normal
		.trim() // trims leading & trailing white spaces
	options.capitalize
		? (returnVal = returnVal.replace(/\b\w/g, function (match) {
				return match.toUpperCase()
		  }))
		: null
	return returnVal
}
