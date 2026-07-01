import { useState } from 'react'
import Flow from './Flow.jsx'
import { Box } from '@washingtonpost/wpds-ui-kit'

const FlowLibrary = () => {
  return (
    <Flow.Root
      css={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        marginBottom: '$350',
        zIndex: 6,
      }}
    >
      <Flow.Background
        showAbacus={false}
        progressiveLoading={true}
        css={{
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        {['yellow', 'cornflowerblue', 'maroon', 'pink'].map(color => {
          return (
            <Flow.Visual
              key={color}
              css={{
                top: 0,
                height: '100vh',
                width: '100%',
                transition: '0.4s',
                position: 'absolute',
              }}
              activeCss={{
                opacity: 1,
              }}
              inactiveCss={{
                opacity: 0,
                pointerEvents: 'none',
              }}
            >
              <Box
                css={{
                  height: '100%',
                  width: '$100%',
                  backgroundColor: color,
                }}
              ></Box>
            </Flow.Visual>
          )
        })}
      </Flow.Background>
      <Flow.Foreground css={{ position: 'relative' }}>
        {['yellow step', 'cornflowerblue step', 'maroon step', 'pink step'].map(
          (stepIndex, i) => (
            <Flow.Step
              css={{
                marginTop: i === 0 ? '-50vh' : 0,
                height: '100vh',
                zIndex: 9,
                padding: '$100',
              }}
              key={stepIndex}
            >
              {stepIndex}
            </Flow.Step>
          )
        )}
      </Flow.Foreground>
    </Flow.Root>
  )
}

const colors = [
  '$purple',
  '$mustard',
  '$gray',
  '$teal',
  '$orange',
  '$pink',
  '$gold',
]

const Debug = () => {
  return (
    <Flow.Root
      css={{
        border: `1px solid $gray40`,
        padding: '$200 $050',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        marginBottom: '$350',
        zIndex: 6,
        '&:before': {
          content: '<Flow.Root>',
          position: 'absolute',
          top: 0,
          left: 0,
        },
      }}
    >
      <Flow.Background
        showAbacus={false}
        progressiveLoading={true}
        css={{
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6].map(color => {
          return (
            <Flow.Visual
              key={color}
              css={{
                top: 0,
                height: '100vh',
                width: '100%',
                transition: '0.4s',
                position: 'absolute',
                border: `1px solid ${colors[color]}400`,
              }}
              activeCss={{
                opacity: 1,
              }}
              inactiveCss={{
                opacity: 0,
                pointerEvents: 'none',
              }}
            >
              <Box
                as="span"
                css={{
                  height: '100%',
                  width: '$100%',
                  backgroundColor: `${colors[color]}500`,
                  textAlign: 'center',
                  fontSize: '2em',
                }}
              >
                {`<Flow.Visual>`}
              </Box>
            </Flow.Visual>
          )
        })}
      </Flow.Background>
      <Flow.Foreground>
        {[0, 1, 2, 3, 4, 5, 6].map((stepIndex, i) => (
          <Flow.Step
            css={{
              margin: `${i === 0 ? '-50vh' : 0} $050 $200`,
              height: '50vh',
              zIndex: 9,
              padding: '$100',
              border: `2px solid ${colors[i]}100`,
            }}
            key={stepIndex}
          >
            {`<Flow.Step>`}: {stepIndex}
          </Flow.Step>
        ))}
      </Flow.Foreground>
    </Flow.Root>
  )
}

const OnChange = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <Flow.Root
      onChange={e => {
        setCurrentIndex(e.currentStepIndex)
      }}
      css={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        marginBottom: '$350',
        zIndex: 6,
      }}
    >
      <Flow.Background
        showAbacus={false}
        progressiveLoading={true}
        css={{
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6].map(color => {
          return (
            <Flow.Visual
              key={color}
              css={{
                top: 0,
                height: '100vh',
                width: '100%',
                transition: '0.4s',
                position: 'absolute',
              }}
              activeCss={{
                opacity: 1,
              }}
              inactiveCss={{
                opacity: 0,
                pointerEvents: 'none',
              }}
            >
              <Box
                css={{
                  height: '100%',
                  width: '$100%',
                  backgroundColor: color,
                  textAlign: 'center',
                  fontSize: '2em',
                }}
              >
                Visual background using currentIndex: {currentIndex}
              </Box>
            </Flow.Visual>
          )
        })}
      </Flow.Background>
      <Flow.Foreground>
        {[0, 1, 2, 3, 4, 5, 6].map((stepIndex, i) => (
          <Flow.Step
            css={{
              marginTop: i === 0 ? '-50vh' : 0,
              height: '50vh',
              zIndex: 9,
              padding: '$100',
            }}
            key={stepIndex}
          >
            This is Step {stepIndex} and the currently active slide is{' '}
            <strong>{currentIndex}</strong>
          </Flow.Step>
        ))}
      </Flow.Foreground>
    </Flow.Root>
  )
}

const OneVisual = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <Flow.Root
      onChange={e => {
        setCurrentIndex(e.currentStepIndex)
      }}
      css={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        marginBottom: '$350',
        zIndex: 6,
      }}
    >
      <Flow.Background
        showAbacus={false}
        css={{
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        <Flow.Visual
          css={{
            top: 0,
            height: '100vh',
            width: '100%',
            transition: '0.4s',
            position: 'absolute',
          }}
        >
          <Box
            css={{
              height: '100%',
              width: '$100%',
              textAlign: 'center',
              fontSize: '2em',
            }}
          >
            This is the same visual being powered by many steps: {currentIndex}
          </Box>
        </Flow.Visual>
      </Flow.Background>
      <Flow.Foreground>
        {[0, 1, 2, 3, 4, 5, 6].map((stepIndex, i) => (
          <Flow.Step
            css={{
              marginTop: i === 0 ? '-50vh' : 0,
              height: '50vh',
              zIndex: 9,
              padding: '$100',
            }}
            key={stepIndex}
          >
            Step {stepIndex}
          </Flow.Step>
        ))}
      </Flow.Foreground>
    </Flow.Root>
  )
}

const PercentVisual = props => {
  const { currentStepIndex, totalStepPercent } = props

  return (
    <Box css={{ marginTop: '$300', fontSize: '1.5em' }}>
      Total percent of all steps {totalStepPercent}
      <br />
      Current step is {currentStepIndex}. <br />
      The heightest indexed non-1 is the current step.
    </Box>
  )
}

const PercentStep = props => {
  const { stepArray, stepIndex } = props

  const step = stepArray[stepIndex]
  const { toViewportTop } = step || {}

  return (
    <Box
      css={{
        backgroundColor: `rgba(255,0,0,${toViewportTop})`,
        marginTop: stepIndex === 0 ? '-50vh' : 0,
        height: '30vh',
        padding: '$100',
        border: '3px solid $purple100',
        marginBottom: '$400',
        maxWidth: '300px',
      }}
    >
      This is Step {stepIndex} and its toViewportTop is:{' '}
      {stepArray[stepIndex].toViewportTop}
    </Box>
  )
}
const Percents = () => {
  return (
    <Flow.Root
      css={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        marginBottom: '$350',
        zIndex: 6,
      }}
    >
      <Flow.Background
        showAbacus={false}
        css={{
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        <Flow.Visual
          css={{
            top: 0,
            height: '100vh',
            width: '100%',
            transition: '0.4s',
            position: 'absolute',
          }}
        >
          <PercentVisual />
        </Flow.Visual>
      </Flow.Background>
      <Flow.Foreground>
        {[0, 1, 2, 3, 4, 5, 6].map((stepIndex, i) => (
          <Flow.Step
            css={{
              marginTop: i === 0 ? '-50vh' : 0,
              height: '50vh',
              zIndex: 9,
              padding: '$100',
            }}
            key={stepIndex}
          >
            <PercentStep />
          </Flow.Step>
        ))}
      </Flow.Foreground>
    </Flow.Root>
  )
}

const IntersectionVisual = props => {
  const { currentStepIndex, totalStepPercent } = props

  return (
    <Box css={{ marginTop: '$300', fontSize: '1.5em' }}>
      Total percent of all steps {totalStepPercent}
      <br />
      Current step is {currentStepIndex}. <br />
      The heightest indexed 1 is the current step.
    </Box>
  )
}

const IntersectionStep = props => {
  const { stepArray, stepIndex } = props

  const step = stepArray[stepIndex]
  const { intersectionRatio } = step || {}

  return (
    <Box
      css={{
        backgroundColor: `rgba(255,0,0,${intersectionRatio})`,
        marginTop: stepIndex === 0 ? '-50vh' : 0,
        height: '30vh',
        padding: '$100',
        border: '3px solid $purple100',
        marginBottom: '$400',
      }}
    >
      This is Step {stepIndex} and its intersectionRatio is:{' '}
      {stepArray[stepIndex].intersectionRatio}
    </Box>
  )
}
const Intersection = () => {
  return (
    <Flow.Root
      percentageUpdater="intersectionRatio"
      css={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        marginBottom: '$350',
        zIndex: 6,
      }}
    >
      <Flow.Background
        showAbacus={false}
        css={{
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        <Flow.Visual
          css={{
            top: 0,
            height: '100vh',
            width: '100%',
            transition: '0.4s',
            position: 'absolute',
          }}
        >
          <IntersectionVisual />
        </Flow.Visual>
      </Flow.Background>
      <Flow.Foreground>
        {[0, 1, 2, 3, 4, 5, 6].map((stepIndex, i) => (
          <Flow.Step
            css={{
              zIndex: 9,
            }}
            key={stepIndex}
          >
            <IntersectionStep />
          </Flow.Step>
        ))}
      </Flow.Foreground>
    </Flow.Root>
  )
}

export default {
  title: 'Furniture/Flow',
  component: FlowLibrary,
  subcomponents: { Root: Flow.Root, ...Flow },
  args: { children: {} },
  componentName: 'Flow',
}

export const BasicFlow = {
  render: Debug,
}

export const OnChangeEvent = {
  name: 'Using onChange event',
  render: OnChange,
}

export const OneVisualMultipleSteps = {
  name: 'One visual, multiple steps',
  render: OneVisual,
}

export const Percentages = {
  name: 'With percentages',
  render: Percents,
}

export const IntersectionPreview = {
  name: 'With intersection ratio',
  render: Intersection,
}
