import { memo, useCallback, useMemo, useState } from 'react';
import Flow from '@/utils/Flow';
import { IntroText } from './introText';

const coverCount = 320;
const eagerCoverCount = 72;
const coverGap = '0.25rem';
const zoomBookTitle = 'esperanza rising';
const esperanzaCutoutSrc = '/drafts/book-bans/esperanza-girl-cutout-v2.png';

const BookWall = memo(function BookWall({
	books,
	highlights = noHighlights,
	isZoomed = false,
	isCutout = false,
}) {
	const booksWithCovers = useMemo(
		() =>
			books
				.filter(
					(book) =>
						book.local_cover_url_small ||
						book.cover_url_small ||
						book.cover_url_medium ||
						book.cover_url_large
				)
				.slice(0, coverCount),
		[books]
	);
	const highlightedBooks = useMemo(() => new Set(highlights), [highlights]);
	const zoomBook =
		booksWithCovers.find(
			(book) => book.title.toLowerCase() === zoomBookTitle
		) || booksWithCovers[zoomBookIndex];
	const zoomCoverSrc =
		zoomBook?.local_cover_url_large ||
		zoomBook?.cover_url_large ||
		zoomBook?.cover_url_medium ||
		zoomBook?.local_cover_url_small ||
		zoomBook?.cover_url_small;

	return (
		<div className='relative left-1/2 h-[100svh] w-screen -translate-x-1/2 overflow-hidden md:h-screen'>
			{zoomCoverSrc ? (
				<link rel='preload' as='image' href={zoomCoverSrc} />
			) : null}
			<link rel='preload' as='image' href={esperanzaCutoutSrc} />
			<div
				className={
					'flex h-[100svh] w-[112vw] flex-wrap content-start justify-center gap-1 transition duration-1000 ease-in-out [--book-column-count:10] [--book-wall-offset:-6vw] [--book-wall-width:112vw] md:h-screen md:w-[110vw] md:[--book-column-count:20] md:[--book-wall-offset:-5vw] md:[--book-wall-width:110vw] lg:[--book-column-count:28]'
				}
				style={{
					filter: isZoomed ? 'grayscale(100%)' : '',
					opacity: isCutout ? 0.1 : isZoomed ? 0.28 : 1,
					transform: isZoomed
						? 'translateX(var(--book-wall-offset, -6vw)) scale(1.08)'
						: 'translateX(var(--book-wall-offset, -6vw)) scale(1)',
				}}
			>
				{booksWithCovers.map((book, index) => {
					const isHighlighted = highlightedBooks.has(index);
					const coverSrc =
						book.local_cover_url_small ||
						book.cover_url_small ||
						book.cover_url_medium ||
						book.cover_url_large;

					return (
						<div
							aria-label={book.title}
							className='relative shrink-0 overflow-hidden bg-zinc-200 shadow-sm'
							key={book.book_id}
							role='img'
							style={{
								aspectRatio: '2 / 3',
								width: `calc((var(--book-wall-width) - (var(--book-column-count) - 1) * ${coverGap}) / var(--book-column-count))`,
							}}
							title={book.title}
						>
							<img
								alt=''
								className='h-full w-full object-cover'
								decoding='async'
								fetchPriority={index < eagerCoverCount ? 'high' : 'low'}
								loading={index < eagerCoverCount ? 'eager' : 'lazy'}
								onError={(event) => {
									event.currentTarget.style.opacity = '0';
								}}
								src={coverSrc}
							/>
							<span
								aria-hidden='true'
								className='pointer-events-none absolute inset-0 transition-opacity duration-300'
								style={{
									boxShadow: isHighlighted ? 'inset 0 0 0 5px red' : 'none',
									opacity: isHighlighted ? 1 : 0,
								}}
							/>
						</div>
					);
				})}
			</div>
			{zoomCoverSrc ? (
				<img
					alt={`Focused cover: ${zoomBook.title}`}
					className='absolute left-1/2 top-1/2 max-h-[72svh] max-w-[76vw] object-contain shadow-2xl transition duration-1000 ease-in-out md:max-h-[78vh] md:max-w-[42vw]'
					decoding='async'
					fetchPriority='high'
					loading='eager'
					src={zoomCoverSrc}
					style={{
						opacity: isCutout ? 0.12 : isZoomed ? 1 : 0,
						transform: isZoomed
							? 'translate(-50%, -50%) scale(1)'
							: 'translate(-50%, -50%) scale(0.38)',
					}}
					title={zoomBook.title}
				/>
			) : null}
			<img
				alt='Esperanza from the Esperanza Rising cover'
				className='pointer-events-none absolute left-1/2 top-1/2 z-10 max-h-[82svh] max-w-[90vw] object-contain transition duration-1000 ease-in-out md:max-h-[86vh] md:max-w-[56vw]'
				decoding='async'
				loading='eager'
				src={esperanzaCutoutSrc}
				style={{
					filter: 'drop-shadow(0 22px 24px rgba(24, 24, 27, 0.2))',
					opacity: isCutout ? 1 : 0,
					transform: isCutout
						? 'translate(-50%, -50%) scale(1)'
						: 'translate(-50%, -50%) scale(0.82)',
				}}
			/>
		</div>
	);
});

const highlightsStep1 = [0, 3, 4, 9, 19, 59, 69];

const highlightsStep2 = [2, 3, 4, 11, 12, 13, 30, 31, 33, 59, 69];

const noHighlights = [];
const zoomBookIndex = 3;
const pageBackgroundColor = '#f7f1ec';

const Step = ({ children, stepIndex }) => {
	console.log('stepindex', stepIndex);
	return (
		<div
			style={{ visibility: stepIndex >= 4 ? 'hidden' : '' }}
			className='mx-4 max-w-xl px-5 py-4 font-serif text-[clamp(1.45rem,7vw,1.875rem)] font-light leading-tight tracking-[-0.015em] text-zinc-950 bg-white md:mx-0 md:px-6 md:py-5 md:text-3xl'
		>
			{children}
		</div>
	);
};

export const BookScrolly = ({ books, eventCount }) => {
	const [highlights, setHighlights] = useState(noHighlights);
	const [currentStepIndex, setCurrentStepIndex] = useState(0);

	const draftSteps = useMemo(
		() => [
			`${eventCount.toLocaleString()} challenged/removal records
	`,
			'Demo Text',
			'Highlight some books',
			'',
			'',
		],
		[eventCount]
	);

	const handleFlowChange = useCallback((event) => {
		setCurrentStepIndex(event.currentStepIndex);

		if (event.currentStepIndex === 2) {
			setHighlights(highlightsStep1);
		} else if (event.currentStepIndex === 3) {
			setHighlights(highlightsStep2);
		} else {
			setHighlights(noHighlights);
		}
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
					<BookWall
						books={books}
						highlights={highlights}
						isZoomed={currentStepIndex >= 4}
						isCutout={currentStepIndex === 5}
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
				{draftSteps.map((step, index) => {
					return (
						<Flow.Step
							key={`step-${index}`}
							renderOnStepChangeOnly={true}
							css={{
								display: 'grid',
								zIndex: 1,
								minHeight: '100vh',
								placeItems: 'center',
							}}
						>
							<Step>{step}</Step>
						</Flow.Step>
					);
				})}
			</Flow.Foreground>
		</Flow.Root>
	);
};
