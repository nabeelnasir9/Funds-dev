'use client'

import { useEffect, Fragment, useState, useMemo } from 'react'
import { useFieldArray, useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format as fechaDateFormat } from 'fecha'
import { Copy } from 'lucide-react'
import toast from 'react-hot-toast'
import { copyObjectToClipBoard } from '@/lib/utils'

import { NO_VALUE } from '@/lib/config'
import { fieldCalculation, cn, genRandString } from '@/lib/utils'
import { type ExtendedForm, type IFormField } from '@/lib/interfaces'
import {
	defaultValueTypes,
	DefaultValueTypes,
	textInputTypes,
	Value,
} from '@/lib/interfaces/formField'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
	SearchableSelect,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { CommonAccordion } from '.'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type CommonForm = {
	type: 'form'
}

type CommonModalForm = {
	type: 'modal'
	closeModal: () => void
}

type CommonFormProps = {
	operationType: 'create' | 'edit'
	extendedForm: ExtendedForm<any>
	onDuplicate: (values: any) => void
	defaultObj?: any
	submitText: string
	cancelText: string
	submitFunc: (values: any) => void
	clearable?: boolean
	fieldsToCopy?: string[]
	nextAndPrev?: boolean
	onNext?: () => void
	onPrev?: () => void
	customOptions?: {
		[key: string]: Value[]
	}
	onChangeValue?: (values: any) => void
	tableForm?: () => JSX.Element
} & (CommonForm | CommonModalForm)

export const CommonForm = (props: CommonFormProps) => {
	const extendedForm = useMemo<ExtendedForm<any>>(
		() =>
			props.extendedForm.map((group) => {
				return {
					...group,
					fields: group.fields.map((field) => {
						if (field.type === 'heading') {
							return field
						}
						let defaultValue = ''
						if (props.defaultObj && props.defaultObj[field.key]) {
							defaultValue =
								field.type === 'date'
									? fechaDateFormat(
											new Date(props.defaultObj[field.key]),
											'YYYY-MM-DD',
									  )
									: String(props.defaultObj[field.key])
						} else if (
							defaultValueTypes.includes(field.defaultValue as DefaultValueTypes)
						) {
							if ((field.defaultValue as DefaultValueTypes) === '_current_date_') {
								defaultValue = fechaDateFormat(new Date(), 'YYYY-MM-DD')
							} else if ((field.defaultValue as DefaultValueTypes) === '_uid_') {
								defaultValue = genRandString()
							}
						} else if (field.defaultValue) {
							defaultValue = field.defaultValue
						}

						if (defaultValue) {
							field.defaultValue = defaultValue
						}
						return field
					}),
				}
			}),
		[props.defaultObj],
	)
	const calculatedValuesConfig = useMemo<
		Record<string, { expression: string; dependencies: string[] }>
	>(() => {
		let returnVal: Record<string, { expression: string; dependencies: string[] }> = {}
		// Looking for calculated values and setting them to calculatedValuesConfig
		extendedForm.forEach((group) => {
			group.fields.forEach((field) => {
				if (field.type === 'heading') {
					return
				}
				if (field.valueType === 'derived') {
					let calculationDeps = fieldCalculation.getDependencyArray(
						props.extendedForm,
						field.expression.replace(/\n|\t/g, ''),
					)

					returnVal[field.key as string] = {
						expression: field.expression.replace(/\n|\t/g, ''),
						dependencies: calculationDeps,
					}
				}
			})
		})
		return returnVal
	}, [props.defaultObj])
	const defaultValues = useMemo<Record<string, any>>(() => {
		let returnVal: Record<string, any> = {}
		extendedForm.forEach((group) => {
			group.fields.forEach((field) => {
				if (field.type !== 'heading') {
					returnVal[String(field.key)] = field.defaultValue
				}
			})
		})
		return returnVal
	}, [extendedForm, props.defaultObj])
	const zodSchema = extractSchemaFromField(extendedForm)

	const form = useForm<any>({
		resolver: zodResolver(zodSchema),
		defaultValues,
	})

	useEffect(() => {
		let subscription: any
		const handler = setTimeout(() => {
			subscription = form.watch((data) => {
				if (props.onChangeValue) {
					props.onChangeValue(data)
				}
				Object.entries(calculatedValuesConfig).forEach(([key, value]) => {
					if (fieldCalculation.checkFields(data, value.dependencies)) {
						const result = String(
							fieldCalculation.multiLineEvaluate(value.expression, data),
						)
						const prevValue = data[key]
						if (result !== prevValue) {
							form.setValue(key, result)
						}
					}
				})
			})
		}, 300)
		return () => {
			clearTimeout(handler)
			if (subscription) {
				subscription.unsubscribe()
			}
		}
	}, [form.watch])

	const onCancel = () => {
		// Resetting Form values manually because form.reset() won't work
		extendedForm.forEach((group) => {
			group.fields.forEach((field) => {
				if (field.type === 'heading') return
				if (field.type === 'select') {
					form.setValue((field as any).key, NO_VALUE)
				} else {
					form.setValue((field as any).key, '')
				}
			})
		})
		form.reset()
		if (props.type === 'modal') props.closeModal()
		if (props.type === 'form') props.submitFunc({})
	}

	useEffect(() => {
		form.reset()
	}, [props.operationType])

	// Resetting Form values manually because next and prev buttons
	useEffect(() => {
		form.reset()
		const keys = Object.keys(defaultValues ?? {})
		keys.forEach((key) => {
			form.setValue(key, defaultValues[key])
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [defaultValues])

	function getRandomNumber() {
		const randomNumber = Math.floor(Math.random() * 10000) + 1

		return randomNumber
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit((values) => {
					let filteredObj: Record<string, any> = {}
					console.log(values,"value in func");
					
					Object.entries(values).forEach(([key, value]) => {
						if (value !== NO_VALUE && (value || typeof value === 'boolean')) {
							if (defaultValues[key] !== value) {
								filteredObj[key] = value
							}
						}
					})
					props.submitFunc(values)
				})}
				className='space-y-3 rounded-lg bg-gray-50 px-8 py-8'>
				{extendedForm.map((group, i) => (
					<Fragment key={group.type + i}>
						{group.type === 'normal-group' ? (
							<div
								className={cn(
									'grid grid-cols-1 gap-x-2 gap-y-3 px-1 sm:grid-cols-2 lg:grid-cols-3',
									group.className,
								)}>
								<FormGroup
									fields={group.fields}
									form={form}
									operationType={props.operationType}
									customOptions={props.customOptions}
								/>
							</div>
						) : group.type === 'accordion' ? (
							<CommonAccordion
								isOpen={group.isOpen}
								accordions={[
									{
										label: group.heading,
										content: (
											<FormGroup
												fields={group.fields}
												form={form}
												operationType={props.operationType}
												customOptions={props.customOptions}
											/>
										),
										classNames: {
											wrapper: group.classNames?.wrapper,
											trigger: group.classNames?.trigger,
											content: cn(
												'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-1 gap-x-2 gap-y-3',
												group.classNames?.content,
												'min-h-[200px]',
											),
										},
									},
								]}
							/>
						) : null}
					</Fragment>
				))}
				{props.tableForm ? props.tableForm() : null}
				<div className='flex justify-between gap-2 pt-6'>
					{props.submitText === 'Update' ? (
						<Button
							className='px-8'
							type='button'
							onClick={() => {
								const { _id, invoice_number, sr_no, ...newObj } = props.defaultObj
								const updatedInvoice = getRandomNumber()
								const updatedSrNo = getRandomNumber()
								const newObject = {
									...newObj,
									invoice_number: updatedInvoice,
									sr_no: updatedSrNo,
								}
								props.onDuplicate(newObject)
							}}>
							Duplicate
						</Button>
					) : null}
					{props.clearable ? (
						<Button
							variant={'outline'}
							type='button'
							className='px-8'
							onClick={() => {
								form.reset()
							}}>
							Clear
						</Button>
					) : null}
					<div className='flex gap-8'>
						<Button
							variant={'outline'}
							className='px-8'
							type='button'
							onClick={onCancel}>
							{props.cancelText}
						</Button>
						<Button type='submit' className='px-8'>
							{props.submitText}
						</Button>
					</div>
					{props.submitText === 'Update' ? (
						<Button
							onClick={() => {
								if (props?.fieldsToCopy) {
									let objectToCopy: Record<string, any> = {}
									props.fieldsToCopy.forEach((field) => {
										objectToCopy[field] = props?.defaultObj?.[field]
									})
									copyObjectToClipBoard(objectToCopy)
								} else {
									copyObjectToClipBoard(props.defaultObj)
								}
								toast.success('Copied Details')
							}}
							variant={'outline'}
							className='ml-28 px-8'
							type='button'>
							<Copy />
						</Button>
					) : null}
				</div>
				{props?.nextAndPrev ? (
					<div className='flex justify-between '>
						<Button
							className='px-8'
							type='button'
							onClick={() => {
								if (props?.onPrev) {
									props.onPrev()
								}
							}}
							variant={'outline'}>
							<ChevronLeft />
						</Button>
						<Button
							className='px-8'
							type='button'
							variant={'outline'}
							onClick={() => {
								if (props?.onNext) {
									props?.onNext()
								}
							}}>
							<ChevronRight />
						</Button>
					</div>
				) : null}
			</form>
		</Form>
	)
}

function FormGroup(props: {
	fields: IFormField<any>[]
	operationType: CommonFormProps['operationType']
	form: UseFormReturn
	customOptions?: {
		[key: string]: Value[]
	}
}) {
	return (
		<>
			{props.fields.map((aField, i) => {
				return (
					<Fragment key={i}>
						{aField.type === 'heading' ? (
							<h3
								className={cn(
									'col-span-full mt-5 border-b border-gray-300 text-xl font-bold text-blue-500',
									aField.className,
								)}>
								{aField.heading}
							</h3>
						) : aField.type === 'select' ? (
							<FormField
								control={props.form.control}
								name={(aField as any).key}
								render={({ field }) => (
									<FormItem className={aField.classNames?.wrapper}>
										<FormLabel className={aField.classNames?.label}>
											{aField.label}
										</FormLabel>
										<FormControl>
											{aField?.searchable ? (
												<SearchableSelect
													placeholder={aField.placeholder}
													options={
														props?.customOptions?.[
															aField?.customOptionsField ?? ''
														] || aField?.values
													}
													form={props.form}
													onChange={field.onChange}
												/>
											) : (
												<Select {...field} onValueChange={field.onChange}>
													<SelectTrigger
														className={
															aField.classNames?.selectTrigger
														}>
														<SelectValue
															className={
																aField.classNames
																	?.selectTriggerValue
															}
															placeholder={aField.placeholder}
														/>
													</SelectTrigger>
													<SelectContent>
														<SelectGroup>
															{(
																props?.customOptions?.[
																	aField?.customOptionsField ?? ''
																] || aField?.values
															).map((value, i) => (
																<SelectItem
																	value={value.value}
																	key={i}
																	className={
																		aField.classNames
																			?.selectItem
																	}>
																	{value.label}
																</SelectItem>
															))}
														</SelectGroup>
													</SelectContent>
												</Select>
											)}
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						) : textInputTypes.includes(aField.type) ? (
							<FormField
								control={props.form.control}
								name={(aField as any).key}
								defaultValue={aField.defaultValue}
								render={({ field }) => {
									return (
										<FormItem
											className={
												aField.classNames && aField.classNames.wrapper
											}>
											<FormLabel
												className={
													aField.classNames && aField.classNames.label
												}>
												{aField.label}
											</FormLabel>
											<FormControl>
												<Input
													type={aField.type}
													{...field}
													placeholder={aField.placeholder}
													className={aField?.classNames?.input}
													disabled={aField.disabled}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)
								}}
							/>
						) : null}
					</Fragment>
				)
			})}
		</>
	)
}

function extractSchemaFromField(form: ExtendedForm<any>) {
	let schemaObj: Record<string, z.ZodTypeAny> = {}
	for (let group of form) {
		for (let field of group.fields) {
			if (field.type !== 'heading' && field.validation) {
				schemaObj[(field as any).key] = field.validation
			}
		}
	}
	return z.object({
		...schemaObj,
	})
}
