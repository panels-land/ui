import type { Component } from 'solid-js'

interface HeadlineProps {
  description?: string
}

export const Headline: Component<HeadlineProps> = props => (
  <>
    <h1 className="text-center text-xl font-bold">{props.children}</h1>
    {props.description && (
      <p className="text-gray-500 px-2 italic">{props.description}</p>
    )}
  </>
)
