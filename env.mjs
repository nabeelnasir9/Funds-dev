import { generateErrorMessage } from 'zod-error'
import { z } from 'zod'

const envSchema = z.object({
	NEXT_PUBLIC_NODE_ENV: z.enum(['development', 'production']).optional().default('development'),
	NEXT_PUBLIC_API_URL: z.string().url(),
})

function validatedEnv() {
	try {
		const env = {
			NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
			NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
		}
		const validationResult = envSchema.parse(env)
		return validationResult
	} catch (error) {
		console.error('Error in Environment Variables')
		console.error(
			generateErrorMessage(error.issues, {
				delimiter: { error: '\n' },
			}),
		)
		// shutting the server down
		process.exit(1)
	}
}

export const env = validatedEnv()
