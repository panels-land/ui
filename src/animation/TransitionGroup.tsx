import type { Component } from 'solid-js'

import { AnimationGroup } from './AnimationGroup'

interface TransitionGroupProps {
  appear?: boolean
  hide?: (element: HTMLElement) => void
  show?: (element: HTMLElement) => void
  enterState: (element: HTMLElement, previousElement?: HTMLElement) => void
  enteredState?: (element: HTMLElement) => void
  enterTransition: (
    element: HTMLElement,
    previousElement?: HTMLElement
  ) => Animation | Promise<Animation>
  exitTransition: (
    element: HTMLElement,
    previousElement?: HTMLElement
  ) => Animation
}

export const TransitionGroup: Component<TransitionGroupProps> = props => {
  const transitions = new Map<string, Promise<any>>()
  const animations = new Map<
    string,
    { animation: Animation & { force?: boolean }; element: HTMLElement }
  >()
  const enterElements = new Map<string, HTMLElement>()
  const waitingElements = new Set<HTMLElement>()

  const {
    hide = el => el.style.setProperty('display', 'none'),
    show = el => el.style.removeProperty('display'),
    enterState,
    enteredState,
    enterTransition,
    exitTransition,
  } = props

  return (
    <AnimationGroup
      appear={props.appear}
      willEnter={el => {
        const { animation: animationId = '' } = el.dataset
        if (animations.has(animationId)) {
          const { animation, element } = animations.get(animationId)!
          try {
            animation.commitStyles()
          } catch {
            //
          }
          animation.finish()

          enterState(el, element)
          enterElements.set(animationId, el)
        } else {
          enterState(el)
          hide(el)
        }
      }}
      onEnter={async element => {
        const { transition: transitionId = '', animation: animationId = '' } =
          element.dataset
        const previousElement = enterElements.get(animationId)
        enterElements.delete(animationId)

        waitingElements.add(element)
        const animation = await enterTransition(element, previousElement)
        if (!waitingElements.has(element)) {
          return
        }
        animation.pause()
        animations.set(animationId, { element, animation })

        await transitions.get(transitionId)
        if (!waitingElements.has(element)) {
          return
        }
        waitingElements.delete(element)

        show(element)
        animation.play()

        animation.finished.then(() => {
          if (!(animation as any).force) {
            enteredState?.(element)
          }
          animations.delete(animationId)
        })
      }}
      onExit={async element => {
        if (waitingElements.has(element)) {
          waitingElements.delete(element)
        }

        const { transition: transitionId = '', animation: animationId = '' } =
          element.dataset

        let previousElement: HTMLElement | undefined
        if (animations.has(animationId)) {
          const a = animations.get(animationId)!
          previousElement = a.element
          try {
            a.animation.commitStyles()
          } catch {
            return
          } finally {
            a.animation.force = true
            a.animation.finish()
          }
        }

        const animation = exitTransition(element, previousElement)

        if (animationId) {
          animations.set(animationId, { element, animation })
          animation.finished.then(() => animations.delete(animationId))
        }

        if (transitionId) {
          animation.finished.then(() => {
            transitions.delete(transitionId)
          })
          transitions.set(
            transitionId,
            animation.finished.then(() => transitions.delete(transitionId))
          )
        }

        await animation.finished
      }}
    >
      {props.children}
    </AnimationGroup>
  )
}
