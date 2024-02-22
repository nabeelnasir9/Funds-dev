import { Metadata } from 'next'

import { UsersTable } from './Table'

export const metadata: Metadata = {
	title: 'Manage Users | Qafila Dashboard',
	description: 'Qafila Travels Dashboard',
}

export default function Dashboard() {
	return (
		<div className='flex flex-1 flex-col'>
			<UsersTable className='flex-1' />
		</div>
	)
}
