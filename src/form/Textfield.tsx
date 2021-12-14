import type { JSX } from 'solid-js'

import { useKeyboard } from '../Keyboard'

interface TextFieldsProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  clearable?: boolean
}

export const Textfield = (props: TextFieldsProps) => {
  const ref = useKeyboard()

  let inputRef!: HTMLInputElement
  return (
    <div
      class={`bg-black bg-opacity-30 rounded-md transition-all flex focus-within:bg-opacity-50 ${
        props.class ?? ''
      }`}
    >
      <input
        {...props}
        ref={input => {
          inputRef = input
          ref(input)
        }}
        placeholder="Search Term"
        class="peer p-2 flex-grow text-white outline-none bg-transparent"
        type={props.type || 'text'}
      />
      {props.clearable && (
        <button
          type="button"
          class="mr-2 transition-opacity opacity-0 peer-focus:opacity-100 peer-placeholder-shown:!opacity-0"
          onClick={() => {
            inputRef.value = ''
            inputRef.dispatchEvent(new Event('change'))
            inputRef.blur()
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  )
}
