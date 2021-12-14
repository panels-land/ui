import type { Component } from 'solid-js'

interface SectionProps {
  label: string
  description?: string
}
export const Section: Component<SectionProps> = props => {
  const handlePointerDown = (event: PointerEvent) => {
    const section = event.currentTarget as HTMLDivElement
    const text = section.querySelector('textarea, input') as
      | HTMLTextAreaElement
      | HTMLInputElement
    if (!text || event.target === text) {
      return
    }

    text.setSelectionRange(text.value.length, text.value.length)
    text.focus()
    event.preventDefault()
  }

  return (
    <div
      className="bg-black bg-opacity-50 pt-2 space-y-2"
      onPointerDown={handlePointerDown}
    >
      <h2 className="text-sm font-bold mx-2">{props.label}</h2>

      {props.description && (
        <p className="text-xs mx-2 italic text-gray-500">{props.description}</p>
      )}
      {props.children}
    </div>
  )
}
