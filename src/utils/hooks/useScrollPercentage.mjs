'use client';

import { useRef, useState, useEffect } from 'react';
import { defaultDataStructure } from './defaultDataStructure';

// To invoke this, merely import the hook into your project
// And attach the ref that you destructure out of the hook to your component.

// import useScrollPercentage from '../components/utils/useScrollPercentage'

// const { ref, inView, entry, percent } = useScrollPercentage({
//   debug: true || false,
//   allPercentages: true || false,
//   viewportPercentage: 0 || 0.5 || 1 <- % of viewport element must cross
// })

const getOffsetFromStart = (object, offset) => {
	offset = offset || 0;
	offset += object.offsetTop;
	if (object.offsetParent) {
		offset = getOffsetFromStart(object.offsetParent, offset);
	}
	return offset;
};

const setBounds = (num) => (num > 1 ? 1 : num < 0 ? 0 : num);

const getIntersectionPercent = (entry, inView) => {
	const {
		intersectionRatio = 0,
		boundingClientRect = { bottom: 0, top: 0 },
	} = entry;
	const { bottom, top } = boundingClientRect;
	const windowHeight =
		typeof window === 'undefined' ? 0 : window.innerHeight || 0;

	return {
		top: inView && top > 0 ? intersectionRatio : top > 0 ? 0 : 1,
		bottom: inView && top < 0 ? 1 - intersectionRatio : top < 0 ? 1 : 0,
		intersectionRatio,
		viewport: {
			isAboveViewport: bottom < 0,
			isBelowViewport: top > windowHeight,
			isInViewport: inView,
		},
	};
};

const useScrollPercentage = (config = {}) => {
	const {
		allPercentages = true,
		debug = false,
		rootMargin = '0px 0px 0px 0px',
		threshold = 0,
		viewportPercentage = 0,
		delay = 400,
	} = config;
	const [target, ref] = useState(null);
	const [entry, setEntry] = useState({});
	const [inView, setInView] = useState(false);
	const ticking = useRef(false);

	const [percent, setPercent] = useState(defaultDataStructure);

	useEffect(() => {
		let observer, handler;
		const hasSupport =
			typeof window !== 'undefined' &&
			typeof window.IntersectionObserver !== 'undefined';

		if (hasSupport) {
			observer = new IntersectionObserver(
				([newEntry]) => {
					setEntry(newEntry);
					if (newEntry.isIntersecting) {
						handler = setTimeout(function timeoutCallback() {
							// Update our state when observer callback fires
							setInView(true);
							setPercent((prev) => ({
								...prev,
								...getIntersectionPercent(newEntry, true),
							}));
						}, delay);
					} else {
						setInView(false);
						setPercent((prev) => ({
							...prev,
							...getIntersectionPercent(newEntry, false),
						}));
					}
				},
				{
					root: null,
					rootMargin,
					threshold,
				}
			);
		}

		if (hasSupport && target) {
			observer.observe(target);
		}
		return () => {
			if (hasSupport && target) {
				observer.unobserve(target);
			}
			clearTimeout(handler);
		};
	}, [delay, target, rootMargin, threshold]);

	useEffect(() => {
		if (target && allPercentages && entry.boundingClientRect) {
			const updatePercentages = () => {
				const { innerHeight: windowHeight, pageYOffset: windowScrollTop } =
					window;
				const elementHeight = target.offsetHeight || entry.boundingClientRect.height;
				const offsetTop = getOffsetFromStart(target);
				const offsetBottom = offsetTop + elementHeight;
				const windowScrollBottom = windowScrollTop + windowHeight;

				setPercent((prev) => ({
					...prev,
					elementThroughViewport: setBounds(
						(windowScrollBottom -
							offsetTop -
							windowHeight * viewportPercentage) /
							elementHeight
					),
					elementAboveViewport: setBounds(
						(windowScrollTop - offsetTop) / elementHeight
					),
					outOfViewport: setBounds(
						(windowScrollBottom - offsetBottom) / windowHeight
					),
					toViewportTop: setBounds(
						(windowScrollBottom - offsetTop) / windowHeight
					),
				}));
				ticking.current = false;
			};

			const onScroll = () => {
				if (!ticking.current) {
					requestAnimationFrame(updatePercentages);
					ticking.current = true;
				}
			};

			updatePercentages();
			window.addEventListener('scroll', onScroll, false);
			window.addEventListener('resize', onScroll, false);

			return () => {
				window.removeEventListener('scroll', onScroll, false);
				window.removeEventListener('resize', onScroll, false);
			};
		}
	}, [target, entry, allPercentages, viewportPercentage]);

	useEffect(() => {
		if (debug) console.log(JSON.stringify(percent, null, 2));
	}, [debug, percent]);

	return { ref, inView, entry, percent };
};

export default useScrollPercentage;
