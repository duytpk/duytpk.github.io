import { useEffect, useState } from 'react'
import { Animator, useBleeps } from '@arwes/react'
import Panel from '../components/Panel.jsx'
import Scramble from '../components/Scramble.jsx'
import { roadmap } from '../data/roadmap.js'
import { useLocalStorageState } from '../hooks/useLocalStorageState.js'

const STORAGE_KEY = 'devsecops-hub:roadmap:v1'

export default function Roadmap() {
  const bleeps = useBleeps()
  const [done, setDone] = useLocalStorageState(STORAGE_KEY, {})
  const [active, setActive] = useState(false)

  useEffect(() => {
    setActive(true)
  }, [])

  const play = (name) => {
    try {
      bleeps[name]?.play()
    } catch {
      /* ignore */
    }
  }

  const toggle = (id) => {
    setDone((prev) => ({ ...prev, [id]: !prev[id] }))
    play('type')
  }

  const resetAll = () => {
    if (typeof window !== 'undefined' && !window.confirm('Reset all roadmap progress?')) return
    setDone({})
    play('click')
  }

  const total = roadmap.reduce((n, t) => n + t.tasks.length, 0)
  const completed = roadmap.reduce(
    (n, t) => n + t.tasks.filter((x) => done[x.id]).length,
    0,
  )
  const overall = total ? Math.round((completed / total) * 100) : 0

  return (
    <div>
      <header className="page-head">
        <h1>
          <Scramble as="span">LEARNING ROADMAP</Scramble>
        </h1>
        <p>
          {'>'} Mission tracks: Linux · Terraform · Kubernetes · progress saved
          locally · {completed}/{total} tasks complete ({overall}%)
        </p>
      </header>

      <div className="tabs" style={{ justifyContent: 'space-between' }}>
        <div className="track__bar" style={{ maxWidth: 360 }}>
          <span style={{ width: `${overall}%` }} />
        </div>
        <button type="button" className="roadmap-reset" onClick={resetAll}>
          ⟲ RESET PROGRESS
        </button>
      </div>

      <Animator active={active} manager="stagger" combine>
        {roadmap.map((track) => {
          const tDone = track.tasks.filter((x) => done[x.id]).length
          const pct = Math.round((tDone / track.tasks.length) * 100)
          return (
            <Animator key={track.id}>
              <Panel className="track" variant={track.color} frame={track.frame}>
                <div className="track__head">
                  <span className={`track__badge glow-${track.color}`}>
                    {track.label}
                  </span>
                  <div className="track__bar">
                    <span style={{ width: `${pct}%` }} />
                  </div>
                  <span className="track__progress">
                    {tDone}/{track.tasks.length} · {pct}%
                  </span>
                </div>
                <p className="news-card__snippet" style={{ marginBottom: '0.5rem' }}>
                  {track.blurb}
                </p>
                <ul className="timeline">
                  {track.tasks.map((task) => {
                    const isDone = !!done[task.id]
                    return (
                      <li key={task.id} className={`task${isDone ? ' is-done' : ''}`}>
                        <label className="task__label">
                          <input
                            type="checkbox"
                            className="task__check"
                            checked={isDone}
                            onChange={() => toggle(task.id)}
                          />
                          <span>
                            <span className="task__text">{task.title}</span>
                            <span className="task__meta">// {task.meta}</span>
                          </span>
                        </label>
                      </li>
                    )
                  })}
                </ul>
              </Panel>
            </Animator>
          )
        })}
      </Animator>
    </div>
  )
}
