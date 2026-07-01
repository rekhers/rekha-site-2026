import Flow from '@/utils/Flow';
import { useState } from 'react';
import { CutoutCaption, InteractiveCutout } from './interactiveCutout';

const title = `The Ban on Becoming`;
const deck = `Across U.S. schools, book bans increasingly target stories about race, gender, and sexuality — restricting how young people encounter lives like their own.`;

const protagonistCutouts = [
	{
		id: 'esperanza',
		title: 'Esperanza Rising',
		year: '2000',
		src: '/drafts/book-bans/esperanza-girl-cutout-v2.png',
		alt: 'Esperanza from the Esperanza Rising cover',
		className:
			'left-[48%] top-[70%] z-20 max-h-[30svh] max-w-[36vw] md:left-[63%] md:top-[72%] md:max-h-[38vh] md:max-w-[22vw]',
		rotation: '2deg',
		shift: { x: '-3vw', y: '-2vh', rotation: '0deg', scale: 1.05 },
	},
	{
		id: 'marji',
		title: 'Persepolis',
		year: '2000',
		src: '/drafts/book-bans/marji-cutout.png',
		alt: 'Marji from the Persepolis cover',
		className:
			'left-[56%] top-[90%] z-30 max-h-[30svh] max-w-[34vw] md:left-[49%] md:top-[91%] md:max-h-[31vh] md:max-w-[20vw]',
		rotation: '-7deg',
		shift: { x: '-6vw', y: '-7vh', rotation: '-2deg', scale: 1.12 },
	},
	{
		id: 'annie-liza',
		title: 'Annie on My Mind',
		year: '1982',
		src: '/drafts/book-bans/annie-liza-cutout.png',
		alt: 'Annie and Liza from the Annie on My Mind cover',
		className:
			'left-[23%] top-[91%] z-20 max-h-[31svh] max-w-[48vw] md:left-[18%] md:top-[90%] md:max-h-[34vh] md:max-w-[30vw]',
		rotation: '4deg',
		shift: { x: '4vw', y: '-5vh', rotation: '0deg', scale: 1.06 },
	},
	{
		id: 'starr',
		title: 'The Hate U Give',
		year: '2017',
		src: '/drafts/book-bans/starr-cutout.png',
		alt: 'Starr from The Hate U Give cover',
		className:
			'left-[84%] top-[70%] z-30 max-h-[25svh] max-w-[30vw] md:left-[75%] md:top-[70%] md:max-h-[34vh] md:max-w-[19vw]',
		rotation: '-3deg',
		shift: { x: '-4vw', y: '-6vh', rotation: '2deg', scale: 1.06 },
	},
	{
		id: 'summer',
		title: 'This One Summer',
		year: '2014',
		src: '/drafts/book-bans/this-one-summer-cutout.png',
		alt: 'The jumping girl from the This One Summer cover',
		className:
			'left-[10%] top-[18%] z-10 max-h-[25svh] max-w-[28vw] md:left-[9%] md:top-[18%] md:max-h-[36vh] md:max-w-[22vw]',
		rotation: '-8deg',
		shift: { x: '4vw', y: '4vh', rotation: '-2deg', scale: 1.08 },
	},
	{
		id: 'aidan',
		title: 'When Aidan Became a Brother',
		year: '2019',
		src: '/drafts/book-bans/aidan-cutout.png',
		alt: 'Aidan from the When Aidan Became a Brother cover',
		className:
			'left-[74%] top-[91%] z-30 max-h-[29svh] max-w-[30vw] md:left-[70%] md:top-[91%] md:max-h-[37vh] md:max-w-[20vw]',
		rotation: '6deg',
		shift: { x: '2vw', y: '-7vh', rotation: '1deg', scale: 1.08 },
	},
	{
		id: 'terabithia',
		title: 'Bridge to Terabithia',
		year: '1977',
		src: '/drafts/book-bans/bridge-to-terabithia-cutout.png',
		alt: 'Jess and Leslie from the Bridge to Terabithia cover',
		className:
			'left-[50%] top-[16%] z-10 max-h-[20svh] max-w-[58vw] md:left-[30%] md:top-[13%] md:max-h-[23vh] md:max-w-[34vw]',
		rotation: '3deg',
		shift: { x: '3vw', y: '4vh', rotation: '-1deg', scale: 1.06 },
	},
	{
		id: 'perks',
		title: 'The Perks of Being a Wallflower',
		year: '1999',
		src: '/drafts/book-bans/perks-legs-cutout.png',
		alt: 'The dangling shoes from The Perks of Being a Wallflower cover',
		className:
			'left-[94%] top-[17%] z-20 max-h-[28svh] max-w-[25vw] md:left-[71%] md:top-[12%] md:max-h-[35vh] md:max-w-[16vw]',
		rotation: '-2deg',
		shift: { x: '-2vw', y: '5vh', rotation: '3deg', scale: 1.04 },
	},
	{
		id: 'caged-bird',
		title: 'I Know Why the Caged Bird Sings',
		year: '1969',
		src: '/drafts/book-bans/caged-bird-cutout.png',
		alt: 'The bird from the I Know Why the Caged Bird Sings cover',
		className:
			'left-[49%] top-[65%] z-0 max-h-[24svh] max-w-[54vw] md:left-[57%] md:top-[36%] md:max-h-[40vh] md:max-w-[40vw]',
		rotation: '-9deg',
		opacity: 0.18,
		shiftOpacity: 0.3,
		shift: { x: '-1vw', y: '2vh', rotation: '-2deg', scale: 1.12 },
	},
	{
		id: 'roll-of-thunder',
		title: 'Roll of Thunder, Hear My Cry',
		year: '1976',
		src: '/drafts/book-bans/roll-of-thunder-cutout.png',
		alt: 'Cassie from the Roll of Thunder, Hear My Cry cover',
		className:
			'left-[47%] top-[58%] z-20 max-h-[42svh] max-w-[44vw] md:top-[56%] md:max-h-[58vh] md:max-w-[29vw]',
		rotation: '-3deg',
		shift: { x: '1vw', y: '1vh', rotation: '1deg', scale: 0.88 },
	},
	{
		id: 'forever',
		title: 'Forever...',
		year: '1975',
		src: '/drafts/book-bans/forever-cutout.png',
		alt: 'The locket from the Forever cover',
		className:
			'left-[94%] top-[51%] z-20 max-h-[29svh] max-w-[34vw] md:left-[90%] md:top-[65%] md:max-h-[42vh] md:max-w-[22vw]',
		rotation: '8deg',
		shift: { x: '-5vw', y: '2vh', rotation: '3deg', scale: 1.08 },
	},
	{
		id: 'poet-x',
		title: 'The Poet X',
		year: '2018',
		src: '/drafts/book-bans/poet-x-cutout.png',
		alt: 'Xiomara from The Poet X cover',
		className:
			'left-[88%] top-[25%] z-10 max-h-[28svh] max-w-[31vw] md:left-[88%] md:top-[25%] md:max-h-[43vh] md:max-w-[26vw]',
		rotation: '5deg',
		shift: { x: '-4vw', y: '4vh', rotation: '0deg', scale: 1.06 },
	},
	{
		id: 'melissa',
		title: 'Melissa',
		year: '2015',
		src: '/drafts/book-bans/melissa-cutout.png',
		alt: 'The colorful Melissa title with Melissa peeking through the final letter',
		className:
			'left-[50%] top-[5%] z-0 max-h-[13svh] max-w-[78vw] md:left-[49%] md:top-[5%] md:max-h-[15vh] md:max-w-[48vw]',
		rotation: '-2deg',
		opacity: 0.86,
		shiftOpacity: 0.95,
		shift: { x: '1vw', y: '4vh', rotation: '1deg', scale: 1.05 },
	},
];

const topperSteps = [{ id: 'collage' }, { id: 'title-cassie-fade' }];

const TopperVisual = ({ currentStepIndex = 0 }) => {
	const [activeSelection, setActiveSelection] = useState(null);
	const activeCutout = protagonistCutouts.find(
		(cutout) => cutout.id === activeSelection?.id
	);
	const activeCutoutVisible =
		currentStepIndex === 0 || activeCutout?.id === 'roll-of-thunder';
	const titleOpacity = currentStepIndex === 0 ? 1 : 0.72;

	return (
		<div className='relative flex h-[100svh] items-center overflow-hidden px-6 py-20 md:h-screen md:px-12'>
			{protagonistCutouts.map(({ id, src }) => (
				<link key={id} rel='preload' as='image' href={src} />
			))}
			<div
				className='relative z-40 mx-auto w-full max-w-[1500px] text-center md:mx-0 md:text-left'
				style={{
					opacity: titleOpacity,
					transform:
						currentStepIndex > 0
							? 'translateY(-3vh) scale(0.98)'
							: 'translateY(0) scale(1)',
					transition: 'opacity 900ms ease, transform 1000ms ease',
				}}
			>
				<h1
					dangerouslySetInnerHTML={{ __html: title }}
					className='font-serif text-[clamp(4rem,14vw,11rem)] font-light leading-[0.86] tracking-[-0.045em] text-zinc-100'
				/>
				<p className='mx-auto mt-6 max-w-[720px] font-serif text-[clamp(1.25rem,2.4vw,2.15rem)] font-light leading-[1.18] tracking-[-0.018em] text-zinc-200 md:mx-0 md:mt-8'>
					{deck}
				</p>
			</div>
			{protagonistCutouts.map((cutout) => {
				const isClosingBeat = currentStepIndex >= 1;
				const opacity =
					isClosingBeat && cutout.id !== 'roll-of-thunder'
						? 0
						: isClosingBeat
						? 0.72
						: cutout.opacity ?? 1;
				const transform =
					isClosingBeat && cutout.id === 'roll-of-thunder'
						? `translate(calc(-50% + ${cutout.shift.x}), calc(-50% + ${cutout.shift.y})) rotate(${cutout.shift.rotation}) scale(${cutout.shift.scale})`
						: `translate(-50%, -50%) rotate(${cutout.rotation}) scale(1)`;

				return (
					<InteractiveCutout
						active={activeSelection?.id === cutout.id}
						alt={cutout.alt}
						className={cutout.className}
						disabled={opacity === 0}
						id={cutout.id}
						key={cutout.id}
						onActiveChange={setActiveSelection}
						src={cutout.src}
						style={{
							filter: 'drop-shadow(0 22px 24px rgba(24, 24, 27, 0.2))',
							opacity,
							transform,
							transition:
								'opacity 800ms ease, transform 1000ms cubic-bezier(0.22, 1, 0.36, 1)',
						}}
						title={cutout.title}
						year={cutout.year}
					/>
				);
			})}
			<CutoutCaption
				anchor={activeSelection?.anchor}
				item={activeCutoutVisible ? activeCutout : null}
			/>
		</div>
	);
};

export const Topper = () => {
	return (
		<Flow.Root
			css={{
				display: 'flex',
				flexDirection: 'column',
				position: 'relative',
				zIndex: 1,
			}}
		>
			<Flow.Background
				showAbacus={false}
				css={{
					height: '100vh',
					overflow: 'hidden',
					position: 'sticky',
					top: 0,
				}}
			>
				<Flow.Visual css={{ height: '100svh', width: '100vw' }}>
					<TopperVisual />
				</Flow.Visual>
			</Flow.Background>
			<Flow.Foreground>
				{topperSteps.map((step) => (
					<Flow.Step
						aria-label={step.id}
						key={step.id}
						renderOnStepChangeOnly={true}
						css={{ minHeight: '100svh', position: 'relative', zIndex: 1 }}
					>
						<div aria-hidden='true' />
					</Flow.Step>
				))}
			</Flow.Foreground>
		</Flow.Root>
	);
};
