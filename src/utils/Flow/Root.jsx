import { Children, createContext, useContext, useReducer, useEffect } from 'react'
import Box from './Box'
import { defaultDataStructure } from '@/utils/hooks'

const range = length => Array.from({ length }, (_, index) => index)

const FlowContext = createContext(null)

/**
 * The getCurrentIndex function returns the current index of the steps in a Flow.
 * percentType is a value from the useScrollPercentageHook that is used to track
 * which step should be the current one. The default is `elementThroughViewport`.
 *
 *  @param {object[]} [array] - Array of scroll tracking values for each step in a Flow. The array is created and updated within Flow context. Each array item has the full percent object from the useScrollPercentage hook.
 *  @param {"elementThroughViewport"|"elementAboveViewport"|"intersectionRatio"|"outOfViewport"|"toViewportTop"} [percentType] - The value from useScrollPercentage that we want to use to determine the active step.
 *  @returns {number} - Returns the index of the currrent step.
 */
const getCurrentIndex = (array, percentType) => {
  const percentsArray = array.map(m => m[percentType])
  const lastStepIndex = percentsArray.length - 1

  /*
    intersectionRatio is handled differently than the other percentType values,
    because it is in relation to the step itself rather than to the top/bottom of the viewport.
    see this documentation for more on intersectionRatio: https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/intersectionRatio
  */
  if (percentType === 'intersectionRatio') {
    const maxPercentValue = Math.max(...percentsArray)
    if (maxPercentValue === 0) {
      // if the max is 0, no step is currently intersecting with the viewport
      // so all steps are either above or below the viewport
      // in either case, the percentsArray will look like [0,0,0,0] and never [1,1,1,1],
      // which is why intersectionRatio is handled differently than the other percentTypes.
      // so we need to check the isAboveViewport value to tell whether it's above or below:
      const allStepsAboveViewport = array.every(m => m.viewport.isAboveViewport)
      // if above, the first step should be active, otherwise the last.
      return allStepsAboveViewport ? lastStepIndex : 0
    } else {
      const activeElementIndex = percentsArray.lastIndexOf(maxPercentValue)
      return activeElementIndex
    }
  }

  /*
    these values are used to figure out where we are in the Flow.
    based on the percentType, a value of 0 or 1 will mean something different about
    where the step is on the viewport. but in all cases, 0 means the step hasn't started 
    being tracked. 1 means the step is done being tracked. if it's between 0 and 1, 
    it's actively being tracked.

    for the default percentType — elementThroughViewport — this array [0, 0, 0, 0]
    means the Flow is below the viewport, and none of the steps have entered the viewport yet.
    once the first step enters the screen, the array might look like: [0.5, 0, 0, 0].
    once the first step is fully through the viewport, the first array value will be 1. 
    while the second step is on screen, it might look like: [1, 0.5, 0, 0]. Once all steps have
    passed through the screen and the Flow is above the viewport, the array would be [1, 1, 1, 1].
  */
  const allPercentsAre0 = percentsArray.every(e => e === 0) // no steps have been tracked yet
  const allPercentsAre1 = percentsArray.every(e => e === 1) // all steps are done being tracked
  const allPercentsAre0or1 = percentsArray.every(e => e === 0 || e === 1) // all steps are either not yet tracked or fully tracked
  const lastElementWithPercent1 = percentsArray.findLastIndex(l => l === 1) // the index of the last step that has been fully tracked
  const largestPercentThatIsNot1 = percentsArray.indexOf(
    Math.max(...percentsArray.filter(f => f !== 1 && f !== undefined))
  ) // the index of the step with the largest percent that is actively being tracked

  if (allPercentsAre0) {
    // no steps have been tracked
    return 0 // so the first step is active
  } else if (allPercentsAre0or1) {
    // no steps are actively tracked
    return lastElementWithPercent1 // so the one that has most recently finished being tracked is active
  } else if (allPercentsAre1) {
    // all steps are done being tracked
    return lastStepIndex // so the last step is active
  } else {
    // otherwise, at least one step is actively being tracked, and has a value btwn 0 and 1.
    // so we return the index of the step with the largest percent value in that range, exclusive.
    return largestPercentThatIsNot1
  }
}

const storyContextReducer = (context, action) => {
  switch (action.name) {
    case 'FLOW_UPDATE': {
      // create a new array based off of stepArray
      const updatedArray = [...context.stepArray]
      // overwite the value of a given index with a given percent
      updatedArray[action.stepIndex] = action.percent

      const totalStepPercent =
        updatedArray.reduce((acc, step) => {
          if (context.percentageUpdater === 'intersectionRatio') {
            return acc + step.outOfViewport
          }
          return acc + step[context.percentageUpdater]
        }, 0) / updatedArray.length

      const currentStepIndex =
        totalStepPercent === 1
          ? updatedArray.length - 1
          : getCurrentIndex(updatedArray, context.percentageUpdater)

      return {
        ...context,
        currentStepIndex,
        currentVisualIndex:
          action.visualIndex !== undefined
            ? action.visualIndex
            : currentStepIndex,
        stepArray: updatedArray,
        allPercents: updatedArray[currentStepIndex],
        totalStepPercent,
      }
    }
    case 'TOGGLE_MUTE': {
      return {
        ...context,
        muted: !context.muted,
      }
    }
    case 'CURRENT_TIME': {
      return {
        ...context,
        currentTime: action.currentTime,
      }
    }
    default: {
      return context
    }
  }
}

/**
 * The Root function wraps all of flow and handles a context that is accessible in all the children of a Flow.
 * Flow excels in telling which element in a group is the "active" one and has loads of ways to calculate that.
 *
 *  @param {children} - The children of Flow.Root should be one Background and one Foreground component, in that order.
 *  @param {object} [props]
 *  @param {object} [props.css] - Optional CSS object to style the Flow container.
 *  @param {function} [props.onChange] - Callback function that is called whenever the current step or visual index changes. The function receives an object with the currentStepIndex and currentVisualIndex as properties.
 *  @param {"elementThroughViewport"|"elementAboveViewport"|"intersectionRatio"|"outOfViewport"|"toViewportTop"} [props.percentageUpdater] - The value from useScrollPercentage that we want to use to determine the active step. Default is "toViewportTop".
 *  @param {string} [props.rootMargin] - The rootMargin value to be passed to the IntersectionObserver used in the useScrollPercentage hook. This can be used to adjust when steps are considered to be in or out of the viewport.
 */
const Root = props => {
  const {
    children,
    css,
    onChange = () => {},
    percentageUpdater = 'toViewportTop',
    rootMargin,
  } = props

  if (process.env.isDev && children[1].type.name !== 'Foreground') {
    throw new Error(
      'Your second element in Flow.Root needs to be Flow.Foreground!'
    )
  }

  const stepCount = Children.count(children[1].props.children)

  const [context, dispatch] = useReducer(storyContextReducer, {
    stepArray: range(stepCount).map(() => defaultDataStructure),
    currentStepIndex: 0,
    currentVisualIndex: 0,
    muted: true,
    percentageUpdater,
    rootMargin,
  })

  useEffect(() => {
    onChange({
      currentStepIndex: context.currentStepIndex,
      currentVisualIndex: context.currentVisualIndex,
    })
  }, [context.currentStepIndex, context.currentVisualIndex, onChange])
  return (
    <Box data-component="Flow" className={props.className} css={css}>
      <FlowContext.Provider value={[context, dispatch]}>
        {children}
      </FlowContext.Provider>
    </Box>
  )
}

export const useFlowContext = () => {
  const [context, dispatch] = useContext(FlowContext)
  return [context, dispatch]
}

export default Root
