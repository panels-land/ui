import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'

interface HeadlineProps extends JSX.HTMLAttributes<HTMLDivElement> {
  description?: string
}

export const Headline: Component<HeadlineProps> = rawProps => {
  const [props, rest] = splitProps(rawProps, ['description', 'children'])
  return (
    <div {...rest}>
      <h1 class="text-center text-xl font-bold">{props.children}</h1>
      {props.description && (
        <p class="text-gray-500 px-2 italic">{props.description}</p>
      )}
    </div>
  )
}
