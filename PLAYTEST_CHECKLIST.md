# PLAYTEST_CHECKLIST

## Basic App

- [ ] `npm install` succeeds.
- [ ] `npm run dev` starts the local server.
- [ ] App loads without a blank screen.
- [ ] Room 0 is visible on first load.
- [ ] left / center / right view buttons work.

## Room 1 Objects

- [ ] Word Billboard opens Inspect Modal.
- [ ] OX Monitor opens Inspect Modal.
- [ ] Number Panel opens Inspect Modal.
- [ ] Name Card Board opens Inspect Modal.
- [ ] Radio Signal Device opens Inspect Modal.
- [ ] Door Keypad opens Door Keypad modal.

## Word Billboard Required Flow

- [ ] Click Word Billboard.
- [ ] Problem data is visible.
- [ ] `Open Python Lab` opens the lab window.
- [ ] Starter code is visible.
- [ ] Editing code persists the draft.
- [ ] `Run Analysis` outputs `SIXSEVENONENINE`.
- [ ] Entering `6719` and pressing `Check Code` collects Door Code piece `7`.
- [ ] Refreshing keeps the solved state and draft.

## Room Clear Flow

- [ ] Required Door Code pieces can be collected.
- [ ] Hidden clues do not block Room clear.
- [ ] Door code attempt is saved.
- [ ] Door code `7479` clears Room 1.
- [ ] Review Panel shows solved puzzles.
- [ ] Review Panel shows unsolved puzzles.
- [ ] Review Panel shows collected hints.
- [ ] Review Panel shows code drafts.
- [ ] Next Room button moves to Room 2.

## Room 4 Review Flow

- [ ] Room 4 shows Missed Clues Board.
- [ ] Missed Clues Board lists unsolved hidden clues from Room 1~3.
- [ ] `다시 풀기` moves back to the original room/object.
- [ ] Solved Route Board shows required puzzle route.
- [ ] Play Style Summary shows used Python tools without score/grade language.
- [ ] Final Exit Door does not require a new code puzzle.
