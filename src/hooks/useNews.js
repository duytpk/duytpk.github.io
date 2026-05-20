import { useCallback, useEffect, useState } from 'react'
import seed from '../data/news.json'

/** Default client-side refetch cadence (ms). */
export const DEFAULT_REFRESH_MS = 5 * 60 * 1000

/**
 * Loads /news.json (served from src/data/news.json by the Vite plugin in dev,
 * and copied into the build output in prod) and refetches it on an interval.
 * Falls back to the statically-imported seed so content always renders.
 */
export function useNews(intervalMs = DEFAULT_REFRESH_MS) {
  const [data, setData] = useState(seed)
  const [status, setStatus] = useState('idle') // idle | loading | ok | error
  const [lastSync, setLastSync] = useState(null)

  const url = `${import.meta.env.BASE_URL}news.json`

  const load = useCallback(async () => {
    setStatus('loading')
    try {
      const res = await fetch(`${url}?t=${Date.now()}`, { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setData(json)
      setStatus('ok')
      setLastSync(new Date())
    } catch {
      // Keep the last good data; just flag the error.
      setStatus('error')
    }
  }, [url])

  useEffect(() => {
    load()
    if (!intervalMs) return undefined
    const id = setInterval(load, intervalMs)
    return () => clearInterval(id)
  }, [load, intervalMs])

  return { data, status, lastSync, reload: load }
}
