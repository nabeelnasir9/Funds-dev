import { Metadata } from 'next'

import { UsersTable } from './Table'
import toast,{Toaster} from 'react-hot-toast'
export const metadata: Metadata = {
	title: 'Manage Cash | Cash Dashboard',
	description: 'Funds Reimbursnment Cash dashboard',
}

export default function Dashboard() {

	
	return (
		<div className='flex flex-1 flex-col'>
			<UsersTable className='flex-1' />
			<Toaster position="top-right" reverseOrder={true} />

		</div>
	)
}
