import { create } from 'zustand'
// import { User } from '@/app/dashboard/users/interfaces'

// interface StoreState {
// 	admin: User | null
// 	url: string | null
// 	setAdmin: (data: User | null) => void
// 	setUrl: (url: string | null) => void
// }

const useStore = create()((set) => ({
	admin: null,
	url: null,
	setAdmin: (data:any) => set({ admin: data }),
	setUrl: (url:any) => set({ url: url }),
}))

export default useStore
