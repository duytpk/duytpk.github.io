import { useEffect, useState } from 'react'
import { Animator, useBleeps } from '@arwes/react'
import Panel from '../components/Panel.jsx'
import Scramble from '../components/Scramble.jsx'
import { useNews } from '../hooks/useNews.js'

const TABS = [
  { key: 'cve', label: 'Vulnerabilities / CVE', tag: 'CVE', variant: 'magenta' },
  { key: 'cloud', label: 'Virtualization & Cloud', tag: 'CLOUD', variant: 'cyan' },
  { key: 'system', label: 'System / Kernel', tag: 'SYS', variant: 'green' },
]

function fmtDate(iso) {
  try {
    return new Date(iso).toISOString().slice(0, 16).replace('T', ' ') + ' UTC'
  } catch {
    return iso || ''
  }
}

export default function Dashboard() {
  const { data, status, lastSync, reload } = useNews()
  const bleeps = useBleeps()
  const [tab, setTab] = useState('cve')
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

  const feeds = data?.feeds || {}
  const current = TABS.find((t) => t.key === tab) || TABS[0]
  const items = feeds[tab] || []

  const onTab = (key) => {
    if (key === tab) return
    setTab(key)
    play('assemble')
  }

  return (
    <div>
      <header className="page-head">
        <h1>
          <Scramble as="span">TECH NEWS DASHBOARD</Scramble>
        </h1>
        <p>
          {'>'} Last updated: {fmtDate(data?.updatedAt)} · source:{' '}
          {data?.generator === 'seed' ? 'seed data' : 'rss aggregator'} · auto-refresh: 5m
          {status === 'loading' && ' · syncing…'}
          {status === 'error' && ' · sync failed (showing cached)'}
          {status === 'ok' && lastSync && ` · synced ${lastSync.toLocaleTimeString()}`}
        </p>
      </header>

      <div className="tabs" role="tablist">
        {TABS.map((t) => {
          const count = (feeds[t.key] || []).length
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={t.key === tab}
              className={`tab${t.key === tab ? ' is-active' : ''}`}
              onClick={() => onTab(t.key)}
            >
              {t.label}
              <span className="tab__count">[{count}]</span>
            </button>
          )
        })}
        <button
          type="button"
          className="tab"
          onClick={() => {
            play('click')
            reload()
          }}
          title="Refetch news.json now"
        >
          ⟳ REFRESH
        </button>
      </div>

      {/* key={tab} remounts the Animator so cards re-decipher on tab change */}
      <Animator active={active} manager="stagger" combine key={tab}>
        {items.length === 0 ? (
          <p className="state-msg">// NO SIGNAL — feed is empty.</p>
        ) : (
          <div className="news-grid">
            {items.map((item, i) => (
              <Animator key={`${item.link}-${i}`}>
                <Panel className="news-card" variant={current.variant} frame="corners">
                  <div className="news-card__src">
                    <span>
                      [{current.tag}] {item.source}
                    </span>
                    <span className="news-card__date">{fmtDate(item.isoDate)}</span>
                  </div>
                  <h3 className="news-card__title">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => play('click')}
                    >
                      <Scramble as="span">{item.title}</Scramble>
                    </a>
                  </h3>
                  <p className="news-card__snippet">{item.contentSnippet}</p>
                  <div className="news-card__cta">» ACCESS_FEED</div>
                </Panel>
              </Animator>
            ))}
          </div>
        )}
      </Animator>
    </div>
  )
}
