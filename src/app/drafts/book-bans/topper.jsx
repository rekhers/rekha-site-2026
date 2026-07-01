import Flow from '@/utils/Flow';

const title = `The Rise of <br/> the Identity-Based Book Ban`;
const deck = `Today’s school book bans increasingly target stories about race, gender, sexuality, and the young people learning to see themselves through them.`;

const protagonistCutouts = [
	{
		id: 'esperanza',
		src: '/drafts/book-bans/esperanza-girl-cutout-v2.png',
		alt: 'Esperanza from the Esperanza Rising cover',
		className:
			'left-[80%] top-[83%] z-20 max-h-[66svh] max-w-[74vw] md:left-[82%] md:top-[55%] md:max-h-[82vh] md:max-w-[46vw]',
		rotation: '2deg',
		shift: { x: '-3vw', y: '-2vh', rotation: '0deg', scale: 1.05 },
	},
	{
		id: 'marji',
		src: '/drafts/book-bans/marji-cutout.png',
		alt: 'Marji from the Persepolis cover',
		className:
			'left-[56%] top-[90%] z-30 max-h-[30svh] max-w-[34vw] md:left-[49%] md:top-[91%] md:max-h-[31vh] md:max-w-[20vw]',
		rotation: '-7deg',
		shift: { x: '-6vw', y: '-7vh', rotation: '-2deg', scale: 1.12 },
	},
	{
		id: 'annie-liza',
		src: '/drafts/book-bans/annie-liza-cutout.png',
		alt: 'Annie and Liza from the Annie on My Mind cover',
		className:
			'left-[23%] top-[91%] z-20 max-h-[31svh] max-w-[48vw] md:left-[18%] md:top-[90%] md:max-h-[34vh] md:max-w-[30vw]',
		rotation: '4deg',
		shift: { x: '4vw', y: '-5vh', rotation: '0deg', scale: 1.06 },
	},
	{
		id: 'starr',
		src: '/drafts/book-bans/starr-cutout.png',
		alt: 'Starr from The Hate U Give cover',
		className:
			'left-[4%] top-[81%] z-10 max-h-[30svh] max-w-[36vw] md:left-[94%] md:top-[86%] md:max-h-[44vh] md:max-w-[25vw]',
		rotation: '-3deg',
		shift: { x: '-4vw', y: '-6vh', rotation: '2deg', scale: 1.06 },
	},
	{
		id: 'summer',
		src: '/drafts/book-bans/this-one-summer-cutout.png',
		alt: 'The jumping girl from the This One Summer cover',
		className:
			'left-[10%] top-[18%] z-10 max-h-[25svh] max-w-[28vw] md:left-[9%] md:top-[18%] md:max-h-[36vh] md:max-w-[22vw]',
		rotation: '-8deg',
		shift: { x: '4vw', y: '4vh', rotation: '-2deg', scale: 1.08 },
	},
	{
		id: 'aidan',
		src: '/drafts/book-bans/aidan-cutout.png',
		alt: 'Aidan from the When Aidan Became a Brother cover',
		className:
			'left-[74%] top-[91%] z-30 max-h-[29svh] max-w-[30vw] md:left-[70%] md:top-[91%] md:max-h-[37vh] md:max-w-[20vw]',
		rotation: '6deg',
		shift: { x: '2vw', y: '-7vh', rotation: '1deg', scale: 1.08 },
	},
];

const topperSteps = [
	{ id: 'collage' },
	{ id: 'collage-shift' },
	{ id: 'esperanza-focus' },
];

const TopperVisual = ({ currentStepIndex = 0 }) => {
	const titleOpacity =
		currentStepIndex === 0 ? 1 : currentStepIndex === 1 ? 0.5 : 0.34;

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
					className='font-serif text-[clamp(4rem,14vw,11rem)] font-light leading-[0.86] tracking-[-0.045em] text-zinc-950'
				/>
				<p className='mx-auto mt-6 max-w-[720px] font-serif text-[clamp(1.25rem,2.4vw,2.15rem)] font-light leading-[1.18] tracking-[-0.018em] text-zinc-900 md:mx-0 md:mt-8'>
					{deck}
				</p>
			</div>
			{protagonistCutouts.map((cutout) => {
				const isShifted = currentStepIndex >= 1;
				const isFinalFocus = currentStepIndex >= 2;
				const opacity = isFinalFocus && cutout.id !== 'esperanza' ? 0 : 1;
				const transform = isShifted
					? `translate(calc(-50% + ${cutout.shift.x}), calc(-50% + ${cutout.shift.y})) rotate(${cutout.shift.rotation}) scale(${cutout.shift.scale})`
					: `translate(-50%, -50%) rotate(${cutout.rotation}) scale(1)`;

				return (
					<img
						alt={cutout.alt}
						className={`pointer-events-none absolute object-contain ${cutout.className}`}
						decoding='async'
						key={cutout.id}
						loading='eager'
						src={cutout.src}
						style={{
							filter: 'drop-shadow(0 22px 24px rgba(24, 24, 27, 0.2))',
							opacity,
							transform,
							transition:
								'opacity 800ms ease, transform 1000ms cubic-bezier(0.22, 1, 0.36, 1)',
						}}
					/>
				);
			})}
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
					height: '100svh',
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
