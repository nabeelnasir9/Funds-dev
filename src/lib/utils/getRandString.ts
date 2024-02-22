/**
 * `genRandString()` gives back random string of alphanumeric characters upto given length
 * @param {number} len default: 16
 * @returns
 */
export function genRandString(len: number = 16): string {
	// genereate random number with length of len without point
	let num = Math.random() * Math.pow(10, len)
	return num.toString()
		// .toString(36)
		// .substring(2, len + 2)
}
