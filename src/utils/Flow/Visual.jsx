import { cloneElement, isValidElement } from 'react'

import Box from './Box'
import { useFlowContext } from './Root'

const VisualChild = props => {
  const { children } = props

  return (
    <>
      {isValidElement(children)
        ? cloneElement(children, { ...props })
        : children}
    </>
  )
}

const getActiveVisuals = (current, i) =>
  [current - 1, current, current + 1].includes(i)

const Visual = props => {
  const {
    children,
    visualIndex,
    css,
    activeCss,
    inactiveCss,
    progressiveLoading,
  } = props
  const [
    {
      currentVisualIndex,
      currentStepIndex,
      currentTime,
      stepArray,
      muted,
      totalStepPercent,
    },
    dispatch,
  ] = useFlowContext()

  const cssToUse = visualIndex <= currentVisualIndex ? activeCss : inactiveCss

  const visualShouldLoad = progressiveLoading
    ? getActiveVisuals(currentVisualIndex, visualIndex)
    : true

  return (
    <Box
      data-component="Flow.Visual"
      css={{
        ...css,
        ...cssToUse,
      }}
      className={props.className}
    >
      {visualShouldLoad ? (
        <VisualChild
          {...props}
          visualIndex={visualIndex}
          currentVisualIndex={currentVisualIndex}
          stepArray={stepArray}
          dispatch={dispatch}
          muted={muted}
          currentTime={currentTime}
          totalStepPercent={totalStepPercent}
          currentStepIndex={currentStepIndex}
        >
          {children}
        </VisualChild>
      ) : null}
    </Box>
  )
}

export default Visual
