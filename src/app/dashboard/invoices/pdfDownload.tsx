import { CheckCircle2, X, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

import { cn, snakeCaseToNormal } from '@/lib/utils'
import axios from 'axios'
import { useEffect } from 'react'

export function PdfDownload({
	obj,
	close,
	className,
}: {
	obj: Record<string, any>
	close?: () => void
	className?: string
}) {
	console.log("obj", obj)
	
	const downloadPdf = async (obj: Record<string, any>) => {
		let config:any = {
		  method: 'post',
		  url: 'https://psestimating.live/generate-pdf',
		  headers: { 
			'Content-Type': 'application/json',
			'Accept': 'application/pdf'
		  },
		  responseType: 'blob', // Ensure response is treated as a Blob
		  data: obj
		};
	  
		try {
		  const response = await axios.request(config);
	  
		  // Download PDF
		  const blob = new Blob([response.data], { type: 'application/pdf' });
		  const url = window.URL.createObjectURL(blob);
	  
		  const link = document.createElement('a');
		  link.href = url;
		  link.download = 'invoices.pdf';
		  link.click();
	  
		  window.URL.revokeObjectURL(url); // Clean up
		} catch (error) {
		  console.error('Error downloading PDF:', error);
		}
	  }
	  
	//   useEffect(() => {
	// 	downloadPdf(obj)
	//   } , [obj])





	return (
		<div
			className={cn(
				'flex items-center justify-center w-full h-full',
				className
			)}
		>
			<div className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
				<div className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full">
					<X size={24} />
				</div>
				<h2 className="mt-4 text-lg font-semibold text-gray-800">
					Generating PDF
				</h2>
				<p className="mt-2 text-sm text-gray-600">
					Please wait while we generate the PDF
				</p>
			</div>
		</div>
	)

	
}
