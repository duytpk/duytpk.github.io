import { useEffect, useState } from 'react'

/** useState that persists JSON to localStorage under `key`. */
export function useLocalStorageState(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw != null ? JSON.parse(raw) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {
      /* storage unavailable (private mode / quota) — ignore */
    }
  }, [key, state])

  return [state, setState]
}
