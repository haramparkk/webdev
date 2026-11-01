import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import axios from 'axios'
import { players, loadPlayer } from './stats'
import Team from './Team'
import Trade from './Trade'
import './style.css'

function App() {
  const [pool, setPool] = useState(players)
  const [refreshing, setRefreshing] = useState(true)
  const [ids, setIds] = useState([])
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const team = pool.filter(player => ids.includes(player.id))

  async function refreshStats() {
    setRefreshing(true)
    const updated = await Promise.all(players.map(loadPlayer))
    setPool(updated)
    setRefreshing(false)
  }

  useEffect(() => {
    async function start() {
      try {
        const response = await axios.get('/api/team')
        setIds(response.data)
        setReady(true)
      } catch {
        setMessage('Could not load your roster. Refresh the page to retry.')
      }
    }
    start()
    refreshStats()
  }, [])

  async function changeRoster(id, add) {
    setBusy(true)
    try {
      const url = '/api/team/' + id
      const response = add ? await axios.put(url) : await axios.delete(url)
      setIds(response.data)
      setMessage('')
    } catch {
      setMessage('Roster update failed. Refresh and try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <BrowserRouter>
      <header>
        <strong>Fantasy Basketball</strong>
        <nav><Link to="/">My Team</Link><Link to="/trade">Trade Analyzer</Link></nav>
      </header>
      <main>
        <p>2026–27 NBA regular season · Season-to-date averages</p>
        <button onClick={refreshStats} disabled={refreshing}>Refresh stats</button>
        <p role="status">{refreshing ? "Checking ESPN..." : pool.filter(p => p.fresh).length + " of " + pool.length + " players updated from ESPN. Any remaining players use the Oct 31 saved averages."}</p>
        <details><summary>League scoring rules</summary><p>PTS + 3PM + 2 × FGM − FGA + FTM − FTA + REB + 2 × AST + 4 × STL + 4 × BLK − 2 × TOV</p></details>
        {message && <p role="alert">{message}</p>}
        <Routes>
          <Route path="/" element={<Team pool={pool} team={team} changeRoster={changeRoster} disabled={!ready || busy} />} />
          <Route path="/trade" element={<Trade pool={pool} team={team} />} />
          <Route path="*" element={<Link to="/">Back to My Team</Link>} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)


