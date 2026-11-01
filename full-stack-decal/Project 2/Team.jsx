import React, { useState } from 'react'
import { score } from './stats'

export default function Team({ pool, team, changeRoster, disabled }) {
  const [search, setSearch] = useState('')
  const available = pool.filter(player =>
    !team.includes(player) && player.name.toLowerCase().includes(search.trim().toLowerCase())
  )
  let total = 0
  for (const player of team) total += score(player)

  function playerList(players, add) {
    return (
      <ul>
        {players.map(player => (
          <li key={player.id}>
            <div>
              <strong>{player.name}</strong> · {score(player).toFixed(1)} fantasy PPG
              <small>{player.points} PTS · {player.rebounds} REB · {player.assists} AST</small>
            </div>
            <button disabled={disabled} onClick={() => changeRoster(player.id, add)}>
              {add ? 'Add' : 'Remove'}
            </button>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <>
      <h1>My Team</h1>
      <p>{team.length} players · {total.toFixed(1)} combined fantasy PPG</p>
      {team.length === 0 && <p>Add your first player below.</p>}
      {playerList(team, false)}
      <h2>Available players</h2>
      <label htmlFor="search">Search by name</label>
      <input id="search" value={search} onChange={event => setSearch(event.target.value)} />
      {playerList(available, true)}
      {available.length === 0 && <p>No matching available players.</p>}
    </>
  )
}
