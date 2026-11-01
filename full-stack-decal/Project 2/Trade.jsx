import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { score } from './stats'

export default function Trade({ pool, team }) {
  const [giveId, setGiveId] = useState('')
  const [getId, setGetId] = useState('')
  const available = pool.filter(player => !team.includes(player))
  const give = team.find(player => player.id === Number(giveId))
  const get = available.find(player => player.id === Number(getId))

  function options(players) {
    return players.map(player => (
      <option key={player.id} value={player.id}>{player.name} ({score(player).toFixed(1)})</option>
    ))
  }

  let result = 'Choose two players to compare.'
  if (give && get) {
    const difference = Number((score(get) - score(give)).toFixed(1))
    result = 'Even trade: your combined fantasy PPG stays the same.'
    if (difference > 0) result = 'Your team would gain ' + difference + ' fantasy PPG.'
    if (difference < 0) result = 'Your team would lose ' + Math.abs(difference) + ' fantasy PPG.'
  }

  return (
    <>
      <h1>Trade Analyzer</h1>
      <p>Compare a one-for-one swap using season averages. Your roster stays the same.</p>
      {team.length === 0 && <p><Link to="/">Add a player to My Team</Link> to try a trade.</p>}
      {available.length === 0 && <p>Every player is on your team. Remove one to compare a trade.</p>}
      <label htmlFor="give">You give</label>
      <select id="give" value={giveId} onChange={event => setGiveId(event.target.value)}>
        <option value="">Choose your player</option>{options(team)}
      </select>
      <label htmlFor="get">You receive</label>
      <select id="get" value={getId} onChange={event => setGetId(event.target.value)}>
        <option value="">Choose an available player</option>{options(available)}
      </select>
      <p role="status">{result}</p>
    </>
  )
}
