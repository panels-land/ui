import { onCleanup, onMount } from 'solid-js'
import type { SpinnerOptions } from 'spin.js'
import { Spinner as BaseSpinner } from 'spin.js'

import 'spin.js/spin.css'

const presets = {
  small: { length: 3, width: 2, radius: 3, lines: 9 },
}

type PresetName = keyof typeof presets

export interface SpinnerProps
  extends Omit<SpinnerOptions, 'position'>,
    Partial<Record<PresetName, boolean>> {
  delay?: number
}

export const Spinner = (props: SpinnerProps) => {
  let ref!: HTMLDivElement
  const { delay, ...rest } = props
  const preset = Object.entries(presets).find(
    ([name]) => rest[name as PresetName]
  )?.[1]

  onMount(() => {
    const spinner = new BaseSpinner({
      color: '#fff',
      ...preset,
      ...rest,
      position: 'static',
    })

    let timeout: NodeJS.Timeout
    if (delay) {
      timeout = setTimeout(() => spinner.spin(ref), delay)
    } else {
      spinner.spin(ref)
    }

    onCleanup(() => clearTimeout(timeout))
  })

  const config = { ...preset, ...rest }
  const size =
    2 * (config.radius || 10) + 2 * ((config.length || 7) + (config.width || 5))
  return (
    <div style={{ width: `${size}px`, height: `${size}px` }}>
      <div
        ref={ref}
        style={{ transform: `translate(${size / 2}px, ${size / 2}px)` }}
      />
    </div>
  )
}
