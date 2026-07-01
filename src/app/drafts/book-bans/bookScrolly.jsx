import { useCallback, useMemo, useState } from 'react';
import Flow from '@/utils/Flow';
import { IntroText } from './introText';
import { PixiBookWall } from './pixiBookWall';

const pageBackgroundColor = '#171716';
const introSteps = ['text-enter', 'text-stick', 'references-enter', 'references-hold'];

const Step = ({ children }) => {
	return (
		<div className='mx-4 max-w-xl bg-white px-5 py-4 font-serif text-[clamp(1.45rem,7vw,1.875rem)] font-light leading-tight tracking-[-0.015em] text-zinc-950 md:mx-0 md:px-6 md:py-5 md:text-3xl'>
			{children}
		</div>
	);
};

export const BookScrolly = ({ books, eventCount }) => {
	const [currentStepIndex, setCurrentStepIndex] = useState(0);
	const canonCount = useMemo(
		() =>
			books.filter(
				(book) => book.school_years.split('|').filter(Boolean).length === 4
			).length,
		[books]
	);
	const draftSteps = useMemo(
		() => [
			`${eventCount.toLocaleString()} challenged or removed book records across four school years.`,
			'A small banned canon keeps returning.',
			`${canonCount.toLocaleString()} books appear in every school year in the dataset.`,
			'',
			'',
		],
		[canonCount, eventCount]
	);
	const scene =
		currentStepIndex >= 7
			? 'focus'
			: currentStepIndex >= 5
				? 'canon'
				: 'wall';

	const handleFlowChange = useCallback((event) => {
		setCurrentStepIndex(event.currentStepIndex);
	}, []);

	return (
		<Flow.Root
			css={{
				backgroundColor: 'transparent',
				display: 'flex',
				flexDirection: 'column',
				position: 'relative',
				zIndex: 1,
			}}
			onChange={handleFlowChange}
		>
			<Flow.Background
				showAbacus={false}
				css={{
					backgroundColor:
						currentStepIndex <= 3 ? 'transparent' : pageBackgroundColor,
					position: 'sticky',
					top: 0,
					height: '100svh',
					overflow: 'hidden',
					transition: 'background-color 1000ms ease',
				}}
			>
				<Flow.Visual
					css={{
						height: '100svh',
						overflow: 'hidden',
						width: '100vw',
					}}
				>
					<div className='relative h-[100svh] w-screen overflow-hidden'>
						<div
							className='absolute inset-0'
							style={{
								opacity: currentStepIndex <= 3 ? 1 : 0,
								pointerEvents: currentStepIndex <= 3 ? 'auto' : 'none',
								transition: 'opacity 800ms ease',
							}}
						>
							<IntroText
								liftText={currentStepIndex >= 1}
								showReferences={currentStepIndex >= 2 && currentStepIndex <= 3}
							/>
						</div>
						<div
							className='absolute inset-0'
							style={{
								opacity: currentStepIndex >= 4 ? 1 : 0,
								pointerEvents: currentStepIndex >= 4 ? 'auto' : 'none',
								transition: 'opacity 1000ms ease 120ms',
							}}
						>
							<PixiBookWall
								books={books}
								isCutout={currentStepIndex === 8}
								isZoomed={currentStepIndex >= 7}
								scene={scene}
							/>
						</div>
					</div>
				</Flow.Visual>
			</Flow.Background>
			<Flow.Foreground>
				{introSteps.map((step) => (
					<Flow.Step
						aria-label={step}
						key={step}
						renderOnStepChangeOnly={true}
						css={{
							minHeight: '100svh',
							pointerEvents: 'none',
							position: 'relative',
							zIndex: 1,
						}}
					>
						<div aria-hidden='true' />
					</Flow.Step>
				))}
				{draftSteps.map((step, index) => (
					<Flow.Step
						key={`step-${index}`}
						renderOnStepChangeOnly={true}
						css={{
							display: 'grid',
							minHeight: '100vh',
							pointerEvents: 'none',
							placeItems: 'center',
							zIndex: 1,
						}}
					>
						{step ? <Step>{step}</Step> : null}
					</Flow.Step>
				))}
			</Flow.Foreground>
		</Flow.Root>
	);
};
