export const IntroText = () => {
	return (
		<div
			className='mx-auto flex w-full max-w-[720px] flex-col gap-6 px-6 font-serif text-[clamp(1.125rem,1.7vw,1.45rem)] font-light leading-[1.65] tracking-[-0.01em] text-zinc-900 md:px-8'
			style={{
				color: 'black',
				maxWidth: '800px',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				margin: '0 auto 40% auto',
				width: '100%',
				fontFamily:
					'Georgia, "Iowan Old Style", "Palatino Linotype", Palatino, serif',
			}}
		>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
				tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
				veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
				commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
				velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
				occaecat cupidatat non proident, sunt in culpa qui officia deserunt
				mollit anim id est laborum.
			</p>
			<p>
				Sed ut perspiciatis unde omnis iste natus error sit voluptatem
				accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab
				illo inventore veritatis et quasi architecto beatae vitae dicta sunt
				explicabo.
			</p>
		</div>
	);
};
