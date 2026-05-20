import {
  FrameCorners,
  FrameOctagon,
  FrameNefrex,
  FrameUnderline,
} from '@arwes/react'

const FRAMES = {
  corners: FrameCorners,
  octagon: FrameOctagon,
  nefrex: FrameNefrex,
  underline: FrameUnderline,
}

/**
 * A glowing Arwes frame panel. The frame SVG sits behind the content; colour
 * is driven by the `.frame--<variant>` CSS classes in index.css.
 *
 * Rendered as plain markup (always visible) — entrance/decipher animation is
 * provided by the surrounding <Animator> and <Scramble> elements.
 */
export default function Panel({
  as: Tag = 'section',
  variant = 'cyan',
  frame = 'corners',
  className = '',
  style,
  children,
}) {
  const FrameComp = FRAMES[frame] || FrameCorners
  return (
    <Tag className={`panel ${className}`} style={style}>
      <FrameComp className={`frame frame--${variant}`} strokeWidth={1.5} />
      <div className="panel__body">{children}</div>
    </Tag>
  )
}
