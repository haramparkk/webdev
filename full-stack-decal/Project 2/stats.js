import axios from 'axios'
import players from './players.json'

export function score(player) {
  const shooting = player.points + player.threes
    + 2 * player.fieldGoalsMade - player.fieldGoalsAttempted
    + player.freeThrowsMade - player.freeThrowsAttempted
  const playmaking = player.rebounds + 2 * player.assists - 2 * player.turnovers
  const defense = 4 * player.steals + 4 * player.blocks
  return shooting + playmaking + defense
}

// Use the saved season numbers if ESPN is unavailable.
export async function loadPlayer(player) {
  try {
    const url = 'https://site.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/' + player.id + '/stats'
    const response = await axios.get(url, { timeout: 5000 })
    const category = response.data.categories[0]
    const season = category.statistics.find(row => row.season.year === 2027)

    // ESPN combines shooting makes and attempts in one string, for example "8.1-18.0".
    function average(name, part = 0) {
      const raw = season.stats[category.names.indexOf(name)]
      const text = String(raw).split('-')[part]
      if (!text || !Number.isFinite(Number(text))) throw new Error('Missing average')
      return Number(text)
    }

    return {
      ...player,
      fresh: true,
      points: average('avgPoints'),
      threes: average('avgThreePointFieldGoalsMade-avgThreePointFieldGoalsAttempted'),
      fieldGoalsMade: average('avgFieldGoalsMade-avgFieldGoalsAttempted'),
      fieldGoalsAttempted: average('avgFieldGoalsMade-avgFieldGoalsAttempted', 1),
      freeThrowsMade: average('avgFreeThrowsMade-avgFreeThrowsAttempted'),
      freeThrowsAttempted: average('avgFreeThrowsMade-avgFreeThrowsAttempted', 1),
      rebounds: average('avgRebounds'),
      assists: average('avgAssists'),
      steals: average('avgSteals'),
      blocks: average('avgBlocks'),
      turnovers: average('avgTurnovers')
    }
  } catch {
    return player
  }
}

export { players }

