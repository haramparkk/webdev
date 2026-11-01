import express from 'express'
import { DatabaseSync } from 'node:sqlite'
import { mkdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

const players = JSON.parse(readFileSync('players.json', 'utf8').replace(/^\uFEFF/, ''))
mkdirSync('data', { recursive: true })
const db = new DatabaseSync('data/basketball.sqlite')
db.exec('CREATE TABLE IF NOT EXISTS roster (id INTEGER PRIMARY KEY)')
const app = express()

function roster() {
  return db.prepare('SELECT id FROM roster ORDER BY id').all().map(row => row.id)
}

app.get('/api/team', (request, response) => {
  response.json(roster())
})

app.put('/api/team/:id', (request, response) => {
  const id = Number(request.params.id)
  if (!players.some(player => player.id === id)) return response.sendStatus(400)
  db.prepare('INSERT OR IGNORE INTO roster (id) VALUES (?)').run(id)
  response.json(roster())
})

app.delete('/api/team/:id', (request, response) => {
  db.prepare('DELETE FROM roster WHERE id = ?').run(request.params.id)
  response.json(roster())
})
app.use('/api', (request, response) => response.sendStatus(404))

// During development Vite shows edits as you make them.
if (process.argv.includes('--production')) {
  app.use(express.static('dist'))
  app.get('*', (request, response) => response.sendFile(path.resolve('dist/index.html')))
} else {
  const { createServer } = await import('vite')
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' })
  app.use(vite.middlewares)
}

const port = process.env.PORT || 3000
app.listen(port, '127.0.0.1', () => console.log('Open http://localhost:' + port))

