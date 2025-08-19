const MessageSkeleton = () => {
	return (
		<>
			<div className='flex gap-3 items-center mb-4'>
				<div className='w-10 h-10 rounded-full shrink-0 bg-gray-700 animate-pulse'></div>
				<div className='flex flex-col gap-2'>
					<div className='h-4 w-40 bg-gray-700 rounded animate-pulse'></div>
					<div className='h-4 w-32 bg-gray-700 rounded animate-pulse'></div>
				</div>
			</div>
			<div className='flex gap-3 items-center justify-end mb-4'>
				<div className='flex flex-col gap-2'>
					<div className='h-4 w-36 bg-gray-700 rounded animate-pulse'></div>
				</div>
				<div className='w-10 h-10 rounded-full shrink-0 bg-gray-700 animate-pulse'></div>
			</div>
			<div className='flex gap-3 items-center mb-4'>
				<div className='w-10 h-10 rounded-full shrink-0 bg-gray-700 animate-pulse'></div>
				<div className='flex flex-col gap-2'>
					<div className='h-4 w-44 bg-gray-700 rounded animate-pulse'></div>
					<div className='h-4 w-28 bg-gray-700 rounded animate-pulse'></div>
				</div>
			</div>
		</>
	);
};
export default MessageSkeleton;
