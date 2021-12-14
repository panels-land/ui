import type { Component, JSX } from 'solid-js'
import {
  createComputed,
  onCleanup,
  createSignal,
  splitProps,
  Show,
} from 'solid-js'

import { Spinner } from '../Spinner'
import { classList } from '../utils'

export interface ButtonProps
  extends Omit<
    JSX.ButtonHTMLAttributes<HTMLButtonElement>,
    'style' | 'onClick'
  > {
  size?: number
  dark?: boolean
  onClick?: (event: MouseEvent) => void | Promise<void>
  spinnerDelay?: number
}

export const Button: Component<ButtonProps> = props => {
  const [split, rest] = splitProps(props, [
    'size',
    'dark',
    'onClick',
    'children',
    'disabled',
    'spinnerDelay',
    'className',
    'classList',
  ])
  const [loading, setLoading] = createSignal(false)
  const [showSpinner, setShowSpinner] = createSignal(false)

  const handleClick = (event: MouseEvent) => {
    const result = split.onClick?.(event)
    if (result instanceof Promise) {
      setLoading(true)
      result.then(() => setLoading(false))
    }
  }

  createComputed(() => {
    if (loading()) {
      const timeout = setTimeout(
        () => setShowSpinner(true),
        split.spinnerDelay ?? 300
      )
      onCleanup(() => clearTimeout(timeout))
    }
  })

  return (
    <button
      type="button"
      {...rest}
      style={{
        'flex-grow': split.size,
      }}
      disabled={loading() || split.disabled}
      onClick={handleClick}
      classList={classList(
        `
          flex-1
          flex
          items-center
          justify-center
          border-[1px]
          bg-opacity-10
          border-opacity-20
          border-white
          text-white
          p-2
          transition-all
          active:bg-opacity-5
          whitespace-nowrap
          overflow-ellipsis
        `,
        split.dark ? 'bg-gray-500' : 'bg-white',
        split.className,
        split.classList
      )}
    >
      <Show
        when={!showSpinner()}
        fallback={
          <>
            &nbsp;
            <Spinner width={3} length={3} radius={4} lines={9} />
            &nbsp;
          </>
        }
      >
        {props.children}
      </Show>
    </button>
  )
}
