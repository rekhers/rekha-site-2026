import { forwardRef } from 'react';

const normalizeCss = (css = {}) => {
	return Object.fromEntries(
		Object.entries(css).filter(([key]) => !key.startsWith('@'))
	);
};

const Box = forwardRef(function Box(
	{ as: Component = 'div', children, className, css, style, ...props },
	ref
) {
	return (
		<Component
			{...props}
			className={className}
			ref={ref}
			style={{ ...normalizeCss(css), ...style }}
		>
			{children}
		</Component>
	);
});

export default Box;
