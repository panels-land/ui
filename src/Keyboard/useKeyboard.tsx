import { onCleanup, useContext } from 'solid-js'

import { keyboardContext } from './keyboardContext'

export const useKeyboard = () => {
  const context = useContext(keyboardContext)
  let input: HTMLElement

  onCleanup(() => {
    input.removeEventListener('focus', context.focus)
    input.removeEventListener('blur', context.blur)
    context.blur()
  })

  return (ref: HTMLElement) => {
    input = ref

    input.addEventListener('focus', context.focus)
    input.addEventListener('blur', context.blur)
  }
}
