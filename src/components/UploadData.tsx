'use client'
import { useState } from 'react'

import { Input } from './ui/input'
import { Button } from './ui/button'

export default function UploadData(props: { onSubmit?: (file: File) => void }) {
	const [file, setFile] = useState<File | null>(null)
	return (
		<div
			about='Upload batch of data from excel file'
			className='flex rounded-md border border-gray-200'>
			<Input
				type='file'
				onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
				className='max-w-[200px] border-0 sm:max-w-[250px]'
				accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv' // only xlsx, xls & csv
			/>
			<Button
				disabled={!file}
				className='rounded-l-none'
				onClick={() => {
					if (props.onSubmit && file) props.onSubmit(file)
				}}>
				Upload
			</Button>
		</div>
	)
}
