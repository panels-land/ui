import type { JSX } from 'solid-js'
import { createEffect, splitProps } from 'solid-js'

import { createRef } from '../utils'

export interface SwitchProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean | string
}

export const Switch = (rawProps: SwitchProps) => {
  const [props, rest] = splitProps(rawProps, ['error', 'class'])
  const ref = createRef<HTMLInputElement>(rawProps.ref)

  createEffect(() => {
    if (props.error) {
      ref.setCustomValidity(
        typeof props.error === 'string' ? props.error : 'Invalid'
      )
    } else {
      ref.setCustomValidity('')
    }
  })

  return (
    <input
      {...rest}
      ref={ref}
      type="checkbox"
      class={`
        appearance-none
        w-14
        h-7
        flex
        items-center
        px-1
        rounded-full
        cursor-pointer
        transition-all
        bg-neutral-800
        checked:bg-highlight-800
        invalid:bg-red-800
        after:block
        after:w-5
        after:h-5
        after:rounded-full
        after:shadow-md
        after:transition-all 
        after:bg-neutral-500
        checked:after:bg-highlight-500
        invalid:after:bg-red-500
        checked:after:translate-x-7
        ${props.class || ''}
      `}
    />
  )
}
