// Central Arwes configuration: animation timing + bleep (sound) settings.
// Sound files live in /public/sounds and are served from the site base URL.

const BASE = import.meta.env.BASE_URL // '/' for the custom domain build

/** Default durations for the global Animator system (seconds). */
export const animatorGeneral = {
  duration: {
    enter: 0.45,
    exit: 0.35,
    stagger: 0.05,
    delay: 0,
    offset: 0,
  },
}

/** BleepsProvider settings: master volume + the named UI sounds. */
export const bleepsSettings = {
  master: { volume: 0.4 },
  bleeps: {
    click: {
      category: 'interaction',
      sources: [{ src: `${BASE}sounds/click.wav`, type: 'audio/wav' }],
    },
    type: {
      category: 'interaction',
      sources: [{ src: `${BASE}sounds/type.wav`, type: 'audio/wav' }],
    },
    assemble: {
      category: 'transition',
      sources: [{ src: `${BASE}sounds/assemble.wav`, type: 'audio/wav' }],
    },
  },
}
