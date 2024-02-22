import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

export function CommonTooltip({
	trigger,
	children,
}: {
	trigger: React.ReactNode
	children: React.ReactNode
}) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>{trigger}</TooltipTrigger>
				<TooltipContent>{children}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
