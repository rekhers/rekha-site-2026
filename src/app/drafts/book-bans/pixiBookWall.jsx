'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const coverCount = 320;
const zoomBookTitle = 'esperanza rising';
const esperanzaCutoutSrc = '/drafts/book-bans/esperanza-girl-cutout-v2.png';
const placeholderColors = [0xd7cec6, 0xc4b7aa, 0xe2d9d0, 0xb8aaa0, 0xccc0b6];

function bookKey(book) {
	return `${book.book_id}|${book.title}`;
}

function hasCover(book) {
	return Boolean(
		book.local_cover_url_small ||
			book.cover_url_small ||
			book.cover_url_medium ||
			book.cover_url_large
	);
}

function coverSource(book) {
	return (
		book.local_cover_url_small ||
		book.cover_url_small ||
		book.cover_url_medium ||
		book.cover_url_large
	);
}

function isCanonBook(book) {
	return book.school_years.split('|').filter(Boolean).length === 4;
}

function hashString(value) {
	let hash = 2166136261;
	for (let index = 0; index < value.length; index += 1) {
		hash ^= value.charCodeAt(index);
		hash = Math.imul(hash, 16777619);
	}
	return hash >>> 0;
}

function wallLayout(index, width) {
	const columns = width < 640 ? 10 : width < 1024 ? 20 : 28;
	const gap = 4;
	const wallWidth = width * 1.1;
	const cardWidth = (wallWidth - gap * (columns - 1)) / columns;
	const row = Math.floor(index / columns);
	const column = index % columns;

	return {
		alpha: 1,
		rotation: 0,
		width: cardWidth,
		x: -width * 0.05 + column * (cardWidth + gap) + cardWidth / 2,
		y: row * (cardWidth * 1.5 + gap) + cardWidth * 0.75,
	};
}

function canonLayout(record, canonIndex, canonCount, width, height) {
	const columns = width < 640 ? 12 : 15;
	const rows = Math.ceil(canonCount / columns);
	const gap = width < 640 ? 2 : 3;
	const maxGridWidth = width * (width < 640 ? 0.88 : 0.72);
	const maxGridHeight = height * 0.86;
	const cardWidth = Math.min(
		(maxGridWidth - gap * (columns - 1)) / columns,
		(maxGridHeight - gap * (rows - 1)) / (rows * 1.5)
	);

	if (canonIndex >= 0) {
		const gridHeight = rows * cardWidth * 1.5 + (rows - 1) * gap;
		const row = Math.floor(canonIndex / columns);
		const column = canonIndex % columns;
		const rowCount = Math.min(columns, canonCount - row * columns);
		const rowWidth = rowCount * cardWidth + (rowCount - 1) * gap;

		return {
			alpha: 1,
			rotation: 0,
			width: cardWidth,
			x: (width - rowWidth) / 2 + column * (cardWidth + gap) + cardWidth / 2,
			y: (height - gridHeight) / 2 + row * (cardWidth * 1.5 + gap) + cardWidth * 0.75,
		};
	}

	const hash = hashString(record.key);
	const wallCardWidth = wallLayout(0, width).width;
	const onRight = hash % 2 === 0;

	return {
		alpha: 0.055,
		rotation: ((hash % 13) - 6) * 0.018,
		width: wallCardWidth * 0.72,
		x: onRight ? width + wallCardWidth * 0.45 : -wallCardWidth * 0.45,
		y: ((hash >>> 4) % 1000) / 1000 * height,
	};
}

function focusLayout(record, index, width, height) {
	const base = wallLayout(index, width);
	return {
		...base,
		alpha: 0.09,
		rotation: ((hashString(record.key) % 9) - 4) * 0.01,
		x: width / 2 + (base.x - width / 2) * 1.06,
		y: height / 2 + (base.y - height / 2) * 1.06,
	};
}

function selectDisplayBooks(books) {
	const booksWithCovers = books.filter(hasCover);
	const canon = booksWithCovers.filter(isCanonBook);
	const esperanza = booksWithCovers.find(
		(book) => book.title.toLowerCase() === zoomBookTitle
	);
	const requiredKeys = new Set(canon.map(bookKey));
	if (esperanza) requiredKeys.add(bookKey(esperanza));

	for (const book of booksWithCovers) {
		if (requiredKeys.size >= coverCount) break;
		requiredKeys.add(bookKey(book));
	}

	return booksWithCovers.filter((book) => requiredKeys.has(bookKey(book))).slice(0, coverCount);
}

function displayAuthor(book) {
	return book.matched_authors || book.author || 'Author unavailable';
}

function BookDetails({ book, mobile = false, onClose }) {
	if (!book) return null;
	const years = book.school_years.split('|').filter(Boolean);
	const cover = coverSource(book);

	return (
		<aside
			aria-live='polite'
			className={
				mobile
					? 'fixed left-3 right-3 top-3 z-50 flex min-h-28 gap-3 border border-zinc-950 bg-white/95 p-3 shadow-xl backdrop-blur-sm md:hidden'
					: 'pointer-events-none absolute right-6 top-1/2 z-20 hidden w-[min(21rem,27vw)] -translate-y-1/2 border-l-2 border-zinc-950 bg-white/95 p-6 shadow-xl backdrop-blur-sm md:block'
			}
		>
			<img
				alt=''
				className={mobile ? 'h-24 w-16 shrink-0 object-cover' : 'mb-5 h-48 w-32 object-cover'}
				src={cover}
			/>
			<div className='min-w-0 font-serif text-zinc-950'>
				<p className='text-xl font-semibold leading-tight md:text-3xl'>{book.title}</p>
				<p className='mt-1 text-sm leading-snug text-zinc-700 md:text-lg'>
					{displayAuthor(book)}
				</p>
				<dl className='mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs leading-snug md:mt-5 md:text-sm'>
					<dt className='font-sans uppercase tracking-wide text-zinc-500'>Years</dt>
					<dd>{years.join(', ')}</dd>
					<dt className='font-sans uppercase tracking-wide text-zinc-500'>Records</dt>
					<dd>{book.ban_count.toLocaleString()}</dd>
					{book.ban_statuses?.length ? (
						<>
							<dt className='font-sans uppercase tracking-wide text-zinc-500'>Status</dt>
							<dd>{book.ban_statuses.join(' / ')}</dd>
						</>
					) : null}
				</dl>
			</div>
			{mobile ? (
				<button
					aria-label='Close book details'
					className='ml-auto self-start border border-zinc-400 px-2 py-1 font-sans text-xs uppercase tracking-wide'
					onClick={onClose}
					type='button'
				>
					Close
				</button>
			) : null}
		</aside>
	);
}

export function PixiBookWall({ books, scene = 'wall', isZoomed, isCutout }) {
	const hostRef = useRef(null);
	const runtimeRef = useRef(null);
	const sceneRef = useRef(scene);
	const [rendererFailed, setRendererFailed] = useState(false);
	const [selectedBook, setSelectedBook] = useState(null);
	const displayBooks = useMemo(() => selectDisplayBooks(books), [books]);
	const canonCount = useMemo(
		() => displayBooks.filter(isCanonBook).length,
		[displayBooks]
	);
	const zoomBook =
		displayBooks.find((book) => book.title.toLowerCase() === zoomBookTitle) ||
		displayBooks[0];
	const zoomCoverSrc =
		zoomBook?.local_cover_url_large ||
		zoomBook?.cover_url_large ||
		zoomBook?.cover_url_medium ||
		zoomBook?.local_cover_url_small ||
		zoomBook?.cover_url_small;

	useEffect(() => {
		sceneRef.current = scene;
		runtimeRef.current?.updateTargets();
		if (scene !== 'canon') {
			runtimeRef.current?.clearSelection();
			setSelectedBook(null);
		}
	}, [scene]);

	function closeBookDetails() {
		runtimeRef.current?.clearSelection();
		setSelectedBook(null);
	}

	useEffect(() => {
		const host = hostRef.current;
		if (!host || displayBooks.length === 0) return undefined;

		let cancelled = false;
		let resizeObserver;
		let textureObserver;
		let visibilityObserver;
		let app;

		async function setup() {
			try {
				const { Application, Assets, Sprite, Texture } = await import('pixi.js');
				if (cancelled) return;

				app = new Application();
				await app.init({
					antialias: false,
					autoDensity: true,
					backgroundAlpha: 0,
					preference: 'webgl',
					resolution: Math.min(window.devicePixelRatio || 1, 1.5),
					resizeTo: host,
				});
				if (cancelled) {
					app.destroy(true, { children: true });
					return;
				}

				app.canvas.className = 'block h-full w-full';
				app.canvas.setAttribute('aria-hidden', 'true');
				app.canvas.style.touchAction = 'pan-y';
				host.appendChild(app.canvas);

				const records = displayBooks.map((book, index) => {
					const sprite = new Sprite(Texture.WHITE);
					const initial = wallLayout(index, app.screen.width);
					sprite.anchor.set(0.5);
					sprite.alpha = 0;
					sprite.tint = placeholderColors[index % placeholderColors.length];
					sprite.position.set(initial.x, initial.y);
					sprite.width = initial.width;
					sprite.height = initial.width * 1.5;
					app.stage.addChild(sprite);

					return {
						book,
						index,
						key: bookKey(book),
						sprite,
						target: initial,
					};
				});
				const canonRecords = records
					.filter((record) => isCanonBook(record.book))
					.sort(
						(left, right) =>
							right.book.ban_count - left.book.ban_count ||
							left.book.title.localeCompare(right.book.title)
					);
				const canonIndexByKey = new Map(
					canonRecords.map((record, index) => [record.key, index])
				);
				const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
				let activeRecord = null;
				const reduceMotion = window.matchMedia(
					'(prefers-reduced-motion: reduce)'
				).matches;

				function clearSelection() {
					if (activeRecord) {
						activeRecord.emphasized = false;
						activeRecord.sprite.zIndex = 0;
					}
					activeRecord = null;
				}

				function selectRecord(record) {
					if (sceneRef.current !== 'canon' || !isCanonBook(record.book)) return;
					clearSelection();
					activeRecord = record;
					record.emphasized = true;
					record.sprite.zIndex = 1000;
					setSelectedBook(record.book);
				}

				app.stage.sortableChildren = true;
				for (const record of records) {
					record.sprite.on('pointerover', () => {
						if (finePointer.matches) selectRecord(record);
					});
					record.sprite.on('pointerout', () => {
						if (!finePointer.matches || activeRecord !== record) return;
						clearSelection();
						setSelectedBook(null);
					});
					record.sprite.on('pointertap', () => {
						if (!finePointer.matches) selectRecord(record);
					});
				}

				function updateTargets() {
					const width = app.screen.width;
					const height = app.screen.height;

					for (const record of records) {
						const isInteractive =
							sceneRef.current === 'canon' && canonIndexByKey.has(record.key);
						record.sprite.eventMode = isInteractive ? 'static' : 'none';
						record.sprite.cursor = isInteractive ? 'pointer' : 'default';
						if (sceneRef.current === 'canon') {
							record.target = canonLayout(
								record,
								canonIndexByKey.get(record.key) ?? -1,
								canonRecords.length,
								width,
								height
							);
						} else if (sceneRef.current === 'focus') {
							record.target = focusLayout(
								record,
								record.index,
								width,
								height
							);
						} else {
							record.target = wallLayout(record.index, width);
						}
					}
				}

				function tick() {
					const easing = reduceMotion ? 1 : 0.095;

					for (const record of records) {
						const { sprite, target } = record;
						sprite.x += (target.x - sprite.x) * easing;
						sprite.y += (target.y - sprite.y) * easing;
						sprite.alpha += (target.alpha - sprite.alpha) * easing;
						sprite.rotation += (target.rotation - sprite.rotation) * easing;
						const targetWidth = target.width * (record.emphasized ? 1.18 : 1);
						const width = sprite.width + (targetWidth - sprite.width) * easing;
						sprite.width = width;
						sprite.height = width * 1.5;
					}
				}

				updateTargets();
				app.ticker.add(tick);
				runtimeRef.current = { clearSelection, updateTargets };
				resizeObserver = new ResizeObserver(() => updateTargets());
				resizeObserver.observe(host);

				async function loadTextures() {
					let nextTextureIndex = 0;
					async function textureWorker() {
						while (!cancelled && nextTextureIndex < records.length) {
							const record = records[nextTextureIndex];
							nextTextureIndex += 1;
							try {
								const texture = await Assets.load(coverSource(record.book));
								if (!cancelled) {
									record.sprite.texture = texture;
									record.sprite.tint = 0xffffff;
								}
							} catch {
								// The tinted placeholder remains when a cover fails.
							}
						}
					}

					await Promise.all(Array.from({ length: 12 }, () => textureWorker()));
				}

				textureObserver = new IntersectionObserver(
					([entry]) => {
						if (!entry.isIntersecting) return;
						textureObserver.disconnect();
						loadTextures();
					},
					{ rootMargin: '100% 0px' }
				);
				textureObserver.observe(host);

				visibilityObserver = new IntersectionObserver(([entry]) => {
					if (entry.isIntersecting) app.ticker.start();
					else app.ticker.stop();
				});
				visibilityObserver.observe(host);
			} catch {
				if (!cancelled) setRendererFailed(true);
			}
		}

		setup();

		return () => {
			cancelled = true;
			resizeObserver?.disconnect();
			textureObserver?.disconnect();
			visibilityObserver?.disconnect();
			runtimeRef.current = null;
			if (app) app.destroy(true, { children: true });
		};
	}, [displayBooks]);

	return (
		<div className='relative left-1/2 h-[100svh] w-screen -translate-x-1/2 overflow-hidden md:h-screen'>
			{zoomCoverSrc ? <link rel='preload' as='image' href={zoomCoverSrc} /> : null}
			<link rel='preload' as='image' href={esperanzaCutoutSrc} />
			<div
				aria-label={`A wall of ${displayBooks.length} frequently banned books. ${canonCount} appear in every school year in the dataset.`}
				className={`absolute inset-0 ${scene === 'canon' ? 'cursor-pointer' : ''}`}
				ref={hostRef}
				role='img'
			/>
			<BookDetails book={selectedBook} />
			{selectedBook && typeof document !== 'undefined'
				? createPortal(
						<BookDetails
							book={selectedBook}
							mobile
							onClose={closeBookDetails}
						/>,
						document.body
					)
				: null}
			{rendererFailed ? (
				<p className='absolute inset-0 grid place-items-center font-serif text-xl text-zinc-700'>
					The book wall could not be rendered.
				</p>
			) : null}
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
}
