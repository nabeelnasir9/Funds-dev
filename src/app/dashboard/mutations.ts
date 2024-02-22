// import { useMutation } from '@tanstack/react-query'

// import { httpClient } from '@/lib/config'
// import { setCookie } from '@/lib/utils'

// export function useLogout() {
// 	return useMutation({
// 		mutationKey: ['admin_logout'],
// 		mutationFn: () => {
// 			setCookie('access_token', '', 0)
// 			delete httpClient.defaults.headers.common['Authorization']
// 			return new Promise((res) =>
// 				setTimeout(() => res({ message: 'Logged out', status: 200 }), 1000),
// 			)
// 		},
// 	})
// }
