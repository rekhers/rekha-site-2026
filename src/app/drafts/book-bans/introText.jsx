import { useState } from 'react';
import { CutoutCaption, InteractiveCutout } from './interactiveCutout';

const references = [
	{
		alt: 'Annie and Liza from the Annie on My Mind cover',
		id: 'annie-liza',
		className:
			'bottom-[1%] left-[-5%] max-h-[35svh] max-w-[52vw] md:bottom-[1%] md:left-[4%] md:max-h-[48vh] md:max-w-[34vw]',
		hiddenTransform: 'translate(-4vw, 4vh) rotate(-9deg) scale(0.88)',
		src: '/drafts/book-bans/annie-liza-cutout.png',
		title: 'Annie on My Mind',
		visibleTransform: 'translate(0, 0) rotate(3deg) scale(1)',
		year: '1982',
	},
	{
		alt: 'The locket from the Forever cover',
		id: 'forever',
		className:
			'right-[-8%] top-[7%] max-h-[36svh] max-w-[42vw] md:right-[2%] md:max-h-[48vh] md:max-w-[27vw]',
		hiddenTransform: 'translate(4vw, -3vh) rotate(15deg) scale(0.88)',
		src: '/drafts/book-bans/forever-cutout.png',
		title: 'Forever...',
		visibleTransform: 'translate(0, 0) rotate(6deg) scale(1)',
		year: '1975',
	},
	{
		alt: 'The dangling shoes from The Perks of Being a Wallflower cover',
		id: 'perks',
		className:
			'bottom-[3%] right-[7%] max-h-[34svh] max-w-[27vw] md:right-[13%] md:max-h-[45vh] md:max-w-[19vw]',
		hiddenTransform: 'translate(2vw, 5vh) rotate(-11deg) scale(0.9)',
		src: '/drafts/book-bans/perks-legs-cutout.png',
		title: 'The Perks of Being a Wallflower',
		visibleTransform: 'translate(0, 0) rotate(-3deg) scale(1)',
		year: '1999',
	},
];

export const IntroText = ({ liftText = false, showReferences = false }) => {
	const [activeSelection, setActiveSelection] = useState(null);
	const activeCutout = references.find(
		(reference) => reference.id === activeSelection?.id
	);

	return (
		<div className='relative flex h-[100svh] w-full items-center justify-center overflow-hidden px-6 py-20'>
			{references.map((reference) => (
				<InteractiveCutout
					active={activeSelection?.id === reference.id}
					alt={reference.alt}
					className={reference.className}
					disabled={!showReferences}
					id={reference.id}
					key={reference.src}
					onActiveChange={setActiveSelection}
					src={reference.src}
					style={{
						opacity: showReferences ? 1 : 0,
						transform: showReferences
							? reference.visibleTransform
							: reference.hiddenTransform,
						transition:
							'opacity 800ms ease, transform 1100ms cubic-bezier(0.22, 1, 0.36, 1)',
					}}
					title={reference.title}
					year={reference.year}
				/>
			))}
			<div
				className='pointer-events-none relative z-20 mx-auto flex w-full max-w-[800px] flex-col gap-6 px-3 text-center font-serif text-[clamp(1.125rem,1.7vw,1.45rem)] font-light leading-[1.65] tracking-[-0.01em] text-zinc-200 md:px-8 md:text-left'
				style={{
					fontFamily:
						'Georgia, "Iowan Old Style", "Palatino Linotype", Palatino, serif',
					transform: liftText ? 'translateY(-12vh)' : 'translateY(0)',
					transition: 'transform 1000ms cubic-bezier(0.22, 1, 0.36, 1)',
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
			<CutoutCaption
				anchor={activeSelection?.anchor}
				item={showReferences ? activeCutout : null}
			/>
		</div>
	);
};
