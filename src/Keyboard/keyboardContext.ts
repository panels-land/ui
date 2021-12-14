import { createContext } from 'solid-js'

export interface KeyboardContext {
  focus: (event: FocusEvent) => void
  blur: (event?: FocusEvent) => void
}

export const keyboardContext = createContext<KeyboardContext>(null as any)
