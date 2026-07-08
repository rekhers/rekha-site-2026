'use client';

const whiteOutline =
	'drop-shadow(1.25px 0 0 white) drop-shadow(-1.25px 0 0 white) drop-shadow(0 1.25px 0 white) drop-shadow(0 -1.25px 0 white)';
const activeWhiteOutline =
	'drop-shadow(2.25px 0 0 white) drop-shadow(-2.25px 0 0 white) drop-shadow(0 2.25px 0 white) drop-shadow(0 -2.25px 0 white)';

export function InteractiveCutout({
	active,
	alt,
	className,
	disabled = false,
	id,
	onActiveChange,
	src,
	style,
	title,
	year,
}) {
	function selectionFor(element) {
		const rect = element.getBoundingClientRect();
		return {
			anchor: { x: rect.left + rect.width / 2, y: rect.bottom + 8 },
			id,
		};
	}

	function handleKeyDown(event) {
		if (disabled) return;
		if (event.key !== 'Enter' && event.key !== ' ') return;
		event.preventDefault();
		onActiveChange(active ? null : selectionFor(event.currentTarget));
	}

	return (
		<img
			alt={alt}
			aria-label={`${title}, published ${year}`}
			aria-pressed={active}
			aria-hidden={disabled}
			className={`absolute cursor-pointer object-contain ${className}`}
			decoding='async'
			loading='eager'
			onClick={(event) => {
				if (!disabled) {
					onActiveChange(active ? null : selectionFor(event.currentTarget));
				}
			}}
			onKeyDown={handleKeyDown}
			onPointerEnter={(event) => {
				if (!disabled && event.pointerType !== 'touch') {
					onActiveChange(selectionFor(event.currentTarget));
				}
			}}
			onPointerLeave={(event) => {
				if (event.pointerType !== 'touch') onActiveChange(null);
			}}
			role='button'
			src={src}
			style={{
				...style,
				filter: active
					? `${activeWhiteOutline} drop-shadow(0 22px 24px rgba(0, 0, 0, 0.48))`
					: `${whiteOutline} ${style?.filter ?? ''}`,
				pointerEvents: disabled ? 'none' : style?.pointerEvents,
			}}
			tabIndex={disabled ? -1 : 0}
		/>
	);
}

export function CutoutCaption({ anchor, item }) {
	if (!item) return null;

	return (
		<div
			className='pointer-events-none absolute z-50 flex max-w-[calc(100vw-1.5rem)] -translate-x-1/2 -rotate-1 items-baseline gap-2 border border-zinc-950 bg-white px-3 py-2 text-zinc-950 shadow-xl'
			style={{
				left: `clamp(7rem, ${anchor?.x ?? 0}px, calc(100% - 7rem))`,
				top: `min(${anchor?.y ?? 0}px, calc(100% - 3.5rem))`,
			}}
		>
			<span className='whitespace-nowrap font-serif text-sm italic md:text-base'>
				{item.title}
			</span>
			<span className='font-sans text-[0.65rem] font-semibold tracking-wide text-zinc-500 md:text-xs'>
				{item.year}
			</span>
		</div>
	);
}
