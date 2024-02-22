import * as z from 'zod'

type NormalValue = {
	/**
	 * @description value that is not calculated from other values in the same object
	 */
	valueType: 'normal'
}

type CalculatedValue = {
	/**
	 * @description value that is calculated from other values in the same object
	 */
	valueType: 'derived'
} & (
	| {
			derivationType: 'arithmetic'
			/**
			 * @description Multi-line Arithmetic Expression that would be resolved in calculation
			 * - **---- Rules ----*
			 * - Each line (except last) must end with semi-colon i.e. ";"
			 * - Name of the variable (except return) must start with an underscore i.e. "_" (to avoid conflicts with base data object's keys)
			 * - The structure of the line must be "variable = expression". These 3 elements are required
			 * - The expected return value must be named as "return" in the last line
			 *
			 */
			expression: string // arithmetic regexp: ^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[+\-*/])(?=.*[ _]).+$
	  }
	| {
			derivationType: 'composition'
			/**
			 * @description expression that would return a string of composition of variables in it.
			 * @example
			 * "first_name last_name" -> "Yousaf Sabir"
			 */
			expression: string
	  }
)

export const defaultValueTypes = ['_current_date_', '_uid_'] as const // underscores to keep it separate from other deafult values

/**
 * Please use typescript's intellisense when using it in form for derived defaultValue
 */
export type DefaultValueTypes = (typeof defaultValueTypes)[number]

type CommonInputData<T> = {
	/**
	 * @description text of the label of the input field
	 */
	label: string
	/**
	 * @description key, by which the value is going to be stored in an object
	 */
	key: keyof T
	/**
	 * @description to set an input's default value. mainly used for editing
	 */
	defaultValue: DefaultValueTypes | string
	/**
	 * @description placeholder of an input
	 */
	placeholder: string
	/**
	 * @description validation of the field by zod
	 */
	validation: z.ZodTypeAny | null
} & (NormalValue | CalculatedValue)

export const textInputTypes = ['text', 'email', 'password', 'date', 'number', 'file'] as const

export type ITextInputField<T> = CommonInputData<T> & {
	type: (typeof textInputTypes)[number]
	classNames?: {
		wrapper?: string
		label?: string
		input?: string
	}
	disabled?: boolean
	searchable?: boolean
}

export interface Value {
	label: string
	value: string
}

type ISelectField<T> = CommonInputData<T> & {
	type: 'select'
	valueType: 'normal' // Selects can't have calculated values for now
	values: Value[]
	classNames?: {
		wrapper?: string
		label?: string
		selectTrigger?: string
		selectTriggerValue?: string
		selectItem?: string
	}
	searchable?: boolean
	customOptionsField?: string
}

// TODO: make an array of such elements which are not form fields
type ISubHeading = {
	type: 'heading'
	heading: string
	className?: string
}

/**
 * @description Common Form Field Type
 */
export type IFormField<T> = ITextInputField<T> | ISelectField<T> | ISubHeading

type FormGroup<T> = {
	fields: IFormField<T>[]
} & (
	| {
			type: 'accordion'
			heading: string
			classNames?: {
				wrapper?: string
				trigger?: string
				content?: string
			}
			isOpen?: string
	  }
	| { type: 'normal-group'; heading?: string; className?: string }
)

export type ExtendedForm<T> = Array<FormGroup<T>>
