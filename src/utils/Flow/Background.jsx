import { cloneElement, Children } from 'react'
import Box from './Box'
import { useFlowContext } from './Root'

import ScrollAbacus from './ScrollAbacus'

const range = length => Array.from({ length }, (_, index) => index)

const Abacus = () => {
  const [context] = useFlowContext()

  const abacusProps = {
    steps: range(context.stepArray.length),
    currentStep: context.currentStepIndex,
    currentStepPct: context.stepArray[context.currentStepIndex].toViewportTop,
  }
  return <ScrollAbacus {...abacusProps} />
}

const Background = props => {
  const { children, css, progressiveLoading, showAbacus } = props

  return (
    <Box data-component="Flow.Background" css={css} className={props.className}>
      {Children.map(children, (child, i) => {
        return cloneElement(child, {
          key: i,
          visualIndex: i,
          progressiveLoading,
        })
      })}
      {showAbacus && <Abacus />}
    </Box>
  )
}

export default Background
