import XLSX from 'xlsx'

export const exportJsonToExcel = (jsonData: object[]) => {
	console.log("🚀 ~ exportJsonToExcel ~ jsonData:", jsonData)
	const data: any[] = []
	const ws = XLSX.utils.json_to_sheet(jsonData)
	const wb = XLSX.utils.book_new()
	XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
	XLSX.writeFile(wb, 'response.xlsx')
}
