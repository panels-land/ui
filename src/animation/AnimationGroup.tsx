/* eslint-disable no-loop-func */
import type { JSX, Component } from 'solid-js'
import { createMemo, createSignal, createEffect, children } from 'solid-js'

function nextFrame(fn: () => void) {
  requestAnimationFrame(() => {
    requestAnimationFrame(fn)
  })
}

export interface AnimationGroupProps {
  appear?: boolean
  enterClass?: string
  enteringClass?: string
  exitClass?: string
  exitingClass?: string
  willEnter?(el: HTMLElement): void
  onEnter(el: HTMLElement): void | Promise<any>
  onExit(el: HTMLElement): Promise<any> | void
  onExit(el: HTMLElement, done: () => void): void
  ignore?: (el: HTMLElement) => boolean
  children?: JSX.Element
}

export const AnimationGroup: Component<AnimationGroupProps> = props => {
  const resolved = children(() => props.children)
  const nodes = createMemo(() => {
    const nodes = resolved()
    const filtered: Array<HTMLElement> = []
    const ignored: Array<HTMLElement> = []

    ;(Array.isArray(nodes) ? nodes : [nodes]).forEach(node => {
      if (!node) {
        return
      }

      if ((node as any).nodeType !== 1) {
        console.warn(
          `A child von AnimationGroup is not a HTMLElement (${node}) and will be ignored`
        )
        return
      }

      if (props.ignore?.(node as HTMLElement)) {
        ignored.push(node as HTMLElement)
        return
      }

      filtered.push(node as HTMLElement)
    })

    return { filtered, ignored }
  })
  const { willEnter, onEnter, onExit } = props
  const [combined, setCombined] = createSignal<Array<Element>>()
  let previous: Array<HTMLElement> = []
  let first = !props.appear
  const exiting = new Set<HTMLElement>()
  createEffect(() => {
    const current = nodes().filtered
    const comb = [...current]
    const next = new Set(current)
    const prev = new Set(previous)

    for (let i = 0; i < current.length; i++) {
      const el = current[i]
      if (!first && !prev.has(el)) {
        willEnter?.(el)
        nextFrame(() => onEnter(el))
      }
    }
    for (let i = 0; i < previous.length; i++) {
      const old = previous[i]
      if (!next.has(old) && old.parentNode) {
        comb.splice(i, 0, old)
        if (!exiting.has(old)) {
          exiting.add(old)
          let exitPromise: Promise<any>
          if (onExit.length === 2) {
            exitPromise = new Promise<void>(resolve => {
              onExit(old, resolve)
            })
          } else {
            exitPromise =
              (onExit as (el: HTMLElement) => Promise<any> | void)(old) ||
              Promise.resolve()
          }
          exitPromise.then(() => {
            exiting.delete(old)
            previous = previous.filter(i => i !== old)
            setCombined(previous)
          })
        }
      }
    }
    previous = comb
    setCombined(comb)
    first = false
  })

  return (
    <>
      {combined()}
      {nodes().ignored}
    </>
  )
}
