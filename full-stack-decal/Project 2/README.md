# Fantasy Basketball

## Try it
1. Install Node.js 22.14 or newer.
2. Open a terminal in the project folder. Run `npm.cmd ci` the first time.
3. Run `npm.cmd run dev` and open http://127.0.0.1:3000/. Keep the terminal open.
4. Add Stephen Curry on My Team. Open Trade Analyzer and compare him with Nikola Jokic.
5. Click Refresh stats to check ESPN. Compare the displayed averages and subtract the outgoing score from the incoming score. Return to My Team and refresh to see that Curry is still saved.

## How it works
- **main.jsx** connects the two pages with React Router. State remembers your roster. An effect loads it from the server when the app opens.
- **stats.js** asks ESPN for each player's 2026–27 regular-season averages using Axios over HTTPS. It uses the included players.json snapshot when a request fails. The score function uses the league formula: PTS + 3PM + 2 × FGM − FGA + FTM − FTA + REB + 2 × AST + 4 × STL + 4 × BLK − 2 × TOV.
- **Team.jsx** filters the player list as you type and adds up your roster's scores. The total assumes each player plays one game.
- **Trade.jsx** holds the two choices in state. It subtracts the outgoing player's score from the incoming player's score.
- **server.js** runs Express. GET reads your roster, PUT adds an ID, and DELETE removes it. SQLite keeps those IDs in data/basketball.sqlite between visits. This local demo has one roster.
- **style.css** controls spacing, colors and text.

## Design and submission
Import Design.svg into Figma and add the feature plan above alongside the two screens. Share the public Figma link and get the design reviewed at office hours. Push the source to GitHub, submit the repository on Gradescope, and demonstrate searching, saving, refreshing, and comparing a trade.


