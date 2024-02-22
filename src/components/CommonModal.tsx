import { forwardRef } from 'react'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export const CommonModal = forwardRef<
	HTMLButtonElement,
	{
		closeModal?: (...args: any[]) => void
		children: React.ReactNode
		className?: string
	}
>((props, triggerRef) => {
	return (
		<>
			<Dialog>
				<DialogTrigger ref={triggerRef} />
				<DialogContent className={cn('w-auto p-0', props.className)}>
					{props.children}
				</DialogContent>
			</Dialog>
		</>
	)
})

CommonModal.displayName = 'CommonModal'
