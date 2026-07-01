import { memo, isValidElement, cloneElement, useEffect } from 'react'
import { useScrollPercentage } from '@/utils/hooks'
import Box from './Box'
import { useFlowContext } from './Root'

const isEqual = (left, right) => JSON.stringify(left) === JSON.stringify(right)

const StepChild = props => {
  const { children } = props
  return (
    <>
      {isValidElement(children)
        ? cloneElement(children, {
            ...props,
          })
        : children}
    </>
  )
}

const stepCheck = (prev, curr) => {
  if (curr.renderOnStepChangeOnly) {
    return isEqual(
      prev.stepArray[prev.stepIndex],
      curr.stepArray[curr.stepIndex]
    )
  } else {
    return prev == curr
  }
}
const MemoizedStep = memo(StepChild, stepCheck)

const Step = props => {
  const { children, stepIndex, css, visualIndex } = props
  const [context, dispatch] = useFlowContext()
  const {
    stepArray,
    currentStepIndex,
    currentVisualIndex,
    percentageUpdater,
    rootMargin,
  } = context

  const { ref, percent } = useScrollPercentage({
    debug: false,
    delay: 0,
    rootMargin,
  })

  useEffect(() => {
    if (
      stepArray[stepIndex]?.[percentageUpdater] !== percent[percentageUpdater]
    ) {
      dispatch({
        name: 'FLOW_UPDATE',
        percent: percent,
        stepIndex,
        visualIndex,
      })
    }
  }, [dispatch, percent, percentageUpdater, stepArray, stepIndex, visualIndex])

  return (
    <Box
      className={props.className}
      css={css}
      ref={ref}
      data-component="Flow.Step"
    >
      <MemoizedStep
        {...props}
        stepArray={stepArray}
        currentStepIndex={currentStepIndex}
        stepIndex={stepIndex}
        currentVisualIndex={currentVisualIndex}
      >
        {children}
      </MemoizedStep>
    </Box>
  )
}

export default Step

Step.defaultProps = {
  percentageUpdater: 'toViewportTop',
}
