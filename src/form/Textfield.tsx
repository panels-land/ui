import type { JSX } from 'solid-js'
import { Show, createEffect, splitProps } from 'solid-js'

import { useKeyboard } from '../Keyboard'
import { createRef } from '../utils'

export interface TextfieldsProps
  extends JSX.InputHTMLAttributes<HTMLInputElement> {
  clearable?: boolean
  error?: boolean | string
  label?: string
}

export const RawTextfield = (rawProps: TextfieldsProps) => {
  const [props, rest] = splitProps(rawProps, [
    'label',
    'error',
    'clearable',
    'ref',
  ])

  const inputRef = createRef<HTMLInputElement>(props.ref)

  createEffect(() => {
    if (props.error) {
      inputRef.setCustomValidity(
        typeof props.error === 'string' ? props.error : 'Invalid'
      )
    } else {
      inputRef.setCustomValidity('')
    }
  })

  return (
    <div class="group relative">
      <input
        ref={inputRef}
        class={`
          bg-neutral-800
          peer
          rounded
          p-2
          ring-2
          ring-highlight-700
          invalid:ring-red-700
          !ring-opacity-0
          group-focus-within:!ring-opacity-100
          duration-200
          transition-all
          w-full
        `}
        placeholder="&nbsp;"
        classList={{
          'pr-10': props.clearable,
        }}
        type="text"
        {...rest}
      />
      <Show when={props.label || props.error}>
        <label
          class={`
            absolute
            -top-0.5
            left-0
            right-0
            flex
            -translate-y-full
            text-highlight-500
            peer-placeholder-shown:left-2
            peer-placeholder-shown:right-2
            peer-placeholder-shown:top-1/2
            peer-placeholder-shown:-translate-y-1/2
            peer-placeholder-shown:text-highlight-700
            peer-invalid:text-red-500
            pointer-events-none
            transition-all
            text-xs
          `}
        >
          {props.label}
          <span class="flex-grow text-right text-red-800 italic">
            {props.error}
          </span>
        </label>
      </Show>
      <Show when={props.clearable}>
        <button
          type="button"
          class={`
            bottom-2
            right-2
            absolute
            transition-opacity
            opacity-0
            text-highlight-500
            peer-invalid:text-red-900
            peer-focus:opacity-100
            peer-placeholder-shown:!opacity-0
          `}
          onPointerDown={event => {
            inputRef.value = ''
            inputRef.dispatchEvent(new Event('change'))
            inputRef.blur()
            event.preventDefault()
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </Show>
    </div>
  )
}

export const Textfield = (rawProps: TextfieldsProps) => {
  const [props, rest] = splitProps(rawProps, ['ref'])
  const ref = createRef(useKeyboard(), props.ref)
  return <RawTextfield {...rest} ref={ref} />
}
