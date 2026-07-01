import { useCallback, useMemo, useState } from 'react';
import Flow from '@/utils/Flow';
import { IntroText } from './introText';
import { PixiBookWall } from './pixiBookWall';

const pageBackgroundColor = '#f7f1ec';

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
		currentStepIndex >= 4
			? 'focus'
			: currentStepIndex >= 2
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
						currentStepIndex === 0 ? 'transparent' : pageBackgroundColor,
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
						opacity: currentStepIndex === 0 ? 0 : 1,
						overflow: 'hidden',
						transition: 'opacity 1000ms ease 120ms',
						width: '100vw',
					}}
				>
					<PixiBookWall
						books={books}
						isCutout={currentStepIndex === 5}
						isZoomed={currentStepIndex >= 4}
						scene={scene}
					/>
				</Flow.Visual>
			</Flow.Background>
			<Flow.Foreground>
				<Flow.Step
					renderOnStepChangeOnly={true}
					css={{
						alignItems: 'center',
						display: 'flex',
						minHeight: '120vh',
						position: 'relative',
						zIndex: 1,
					}}
				>
					<IntroText />
				</Flow.Step>
				{draftSteps.map((step, index) => (
					<Flow.Step
						key={`step-${index}`}
						renderOnStepChangeOnly={true}
						css={{
							display: 'grid',
							minHeight: '100vh',
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
