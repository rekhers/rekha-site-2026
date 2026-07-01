import { Children, cloneElement } from 'react'

const Foreground = props => {
  const { children } = props

  return Children.map(children, (child, i) => {
    return cloneElement(child, { stepIndex: i })
  })
}

export default Foreground
