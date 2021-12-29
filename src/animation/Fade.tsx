import type { Component } from 'solid-js'

import { TransitionGroup } from './TransitionGroup'

export interface FadeProps {
  appear?: boolean
  delay?: number
  duration?: number
  enterDuration?: number
  exitDuration?: number
  ignore?: (el: HTMLElement) => boolean
}

export const Fade: Component<FadeProps> = props => (
  <TransitionGroup
    ignore={props.ignore}
    appear={props.appear}
    enterState={(element, previousElement) => {
      element.style.setProperty(
        'opacity',
        previousElement?.style.getPropertyValue('opacity') || '0'
      )
    }}
    enteredState={element => {
      element.style.setProperty('transition', 'none')
      element.style.removeProperty('opacity')
      element.offsetHeight
      element.style.removeProperty('transition')
    }}
    enterTransition={async (element, previousElement) => {
      if (props.delay) {
        await new Promise(resolve => setTimeout(resolve, props.delay))
      }
      const previousOpacity = previousElement?.style.getPropertyValue('opacity')
      const baseDuration = props.enterDuration || props.duration || 300

      const duration = previousOpacity
        ? (1 - Number(previousOpacity)) * baseDuration
        : baseDuration
      return element.animate([{ opacity: 1 }], { duration })
    }}
    exitTransition={(element, previousElement) => {
      const baseDuration = props.exitDuration || props.duration || 300
      const previousOpacity = previousElement?.style.getPropertyValue('opacity')
      const duration = previousOpacity
        ? (1 - Number(previousOpacity)) * baseDuration
        : baseDuration
      return element.animate([{ opacity: 0 }], { duration })
    }}
  >
    {props.children}
  </TransitionGroup>
)
