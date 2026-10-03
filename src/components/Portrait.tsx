/** @jsxImportSource solid-js */
import type { JSX } from 'solid-js';
import { personalities } from '../copy/personalities';

export interface PortraitProps {
  code: string;
  size?: number | string;
  class?: string;
}

export default function Portrait(props: PortraitProps): JSX.Element {
  const width = () =>
    typeof props.size === 'number' ? `${props.size}px` : props.size ?? '140px';
  const personality = () => personalities[props.code];
  return (
    <div
      class={`portrait-ring portrait-seal ${props.class ?? ''}`}
      style={{
        width: width(),
        '--portrait-accent': personality()?.color ?? '#e87524',
      }}
      role="img"
      aria-label={`${personality()?.name ?? props.code} 人格图章`}
    >
      <span class="portrait-seal-orbit" aria-hidden="true" />
      <span class="portrait-seal-spark portrait-seal-spark--one" aria-hidden="true">✦</span>
      <span class="portrait-seal-spark portrait-seal-spark--two" aria-hidden="true">✷</span>
      <span class="portrait-seal-emoji" aria-hidden="true">
        {personality()?.emoji ?? '♡'}
      </span>
      <span class="portrait-seal-code" aria-hidden="true">{props.code}</span>
    </div>
  );
}
