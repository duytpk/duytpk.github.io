import { Text } from '@arwes/react'

/**
 * Decipher / "typewriter-scramble" text. Animates when inside an active
 * Animator, but stays visible otherwise (hideOnExited=false) so content is
 * never permanently hidden. Children must be a plain string.
 */
export default function Scramble({ as = 'span', className, children, fixed = true }) {
  return (
    <Text as={as} className={className} manager="decipher" fixed={fixed} hideOnExited={false}>
      {children}
    </Text>
  )
}
