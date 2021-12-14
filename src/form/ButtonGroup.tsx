import type { Component } from 'solid-js'

export const ButtonGroup: Component = props => (
  <div className="flex-grow flex items-end ml-[-1px] mr-[-1px] !mb-[-1px] overflow-hidden">
    {props.children}
  </div>
)
