const ScrollAbacus = ({ steps = [], currentStep = 0, currentStepPct = 0 }) => {
	return (
		<div
			data-component='ScrollAbacus'
			style={{
				position: 'absolute',
				right: 10,
				top: 70,
				zIndex: 2,
				display: 'flex',
				height: 'calc(100vh - 70px)',
				width: 12,
				flexDirection: 'column',
				gap: 7,
			}}
		>
			{steps.map((step) => {
				const pct =
					step < currentStep ? 1 : step === currentStep ? currentStepPct || 0 : 0;

				return (
					<div
						key={step}
						style={{
							flex: 1,
							position: 'relative',
							background: 'rgba(255,255,255,0.35)',
						}}
					>
						<div
							style={{
								position: 'absolute',
								inset: 'auto 0 0',
								height: `${pct * 100}%`,
								background: 'white',
								transition: 'height 80ms ease-out',
							}}
						/>
					</div>
				);
			})}
		</div>
	);
};

export default ScrollAbacus;
