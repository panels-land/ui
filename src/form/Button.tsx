import { Show } from 'solid-js'
import type { JSX, Component } from 'solid-js'

import { Spinner } from '../Spinner'

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
}

export const Button: Component<ButtonProps> = props => (
  <button
    {...props}
    disabled={props.disabled || props.loading}
    class={`p-2 rounded transition-all duration-300 uppercase relative ${
      props.class ?? ''
    }`}
    classList={{
      'text-lime-500 bg-lime-900 drop-shadow-lg bg-opacity-0 hover:bg-opacity-30':
        !props.disabled && !props.loading,
      'text-neutral-500 bg-neutral-900 cursor-not-allowed': props.disabled,
      'text-lime-500 bg-lime-900 bg-opacity-0 cursor-wait': props.loading,
    }}
  >
    <Show when={props.loading}>
      <div class="absolute inset-0 flex items-center justify-center">
        <Spinner small color="rgb(132, 204, 22)" />
      </div>
    </Show>
    <span
      class={`transition-opacity ${
        props.loading ? 'opacity-10' : 'opacity-100'
      }`}
    >
      {props.children}
    </span>
  </button>
)
