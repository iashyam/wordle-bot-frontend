# Wordle Solver UI – React Implementation Spec

## Overview

Frontend for the Wordle Solver engine. The interface mimics the Wordle board where users enter a guess and click tiles to set the color pattern. After submission, solver suggestions appear from a bottom sliding panel.

The backend exposes a session based API used by the frontend to start a game session and compute optimal guesses.

---

# Tech Stack

React
TypeScript
TailwindCSS
Framer Motion (for bottom sheet animation)

---

# High Level Architecture

App
Header
RemainingSolutions
WordGrid
Tile
ApplyPatternButton
Keyboard
SuggestionsSheet
SuggestionItem

---

# Data Models

## TileState

Represents each tile in the grid.

```
type TileState = {
  letter: string
  color: "gray" | "yellow" | "green"
}
```

## GuessRow

```
type GuessRow = TileState[]
```

## Board

```
type Board = GuessRow[]
```

---

# Solver API Integration

The frontend communicates with a session based solver backend.

## Health Check

GET /health

Response

```
{
  "status": "ok"
}
```

## Start Session

POST /start

Body

```
{
  "session_id": "USER-ID"
}
```

Response

```
{
  "session_id": "string",
  "message": "Session started",
  "remaining_count": number,
  "best_guesses": [
    {
      "word": "raise",
      "info": 5.87
    }
  ]
}
```

## Predict Next Word

POST /predict_next_word

Body

```
{
  "session_id": "USER-ID",
  "guess": "raise",
  "pattern": "BBYGB"
}
```

Response

```
{
  "session_id": "string",
  "remaining_count": number,
  "best_guesses": [...],
  "history": [...]
}
```

## Close Session

POST /close

Body

```
{
  "session_id": "USER-ID"
}
```

---

# Pattern Encoding

Frontend converts tile colors to pattern string before sending request.

Mapping

```
gray   -> B
yellow -> Y
green  -> G
```

Example

Tiles

Gray Gray Yellow Gray Green

Pattern

```
BBYBG
```

---

# Component Specification

## Header

Displays

Title: Wordle Bot
Session indicator
Reset button

---

## RemainingSolutions

Displays number of possible remaining words.

Example

Remaining: 80

---

## WordGrid

Displays 6 rows of 5 tiles.

State controlled by Board state.

Each tile is clickable to cycle color.

---

## Tile

Click behavior cycles through states.

```
gray → yellow → green → gray
```

Example style states

Gray
Yellow
Green

---

## Keyboard

Used to type guesses.

Features

Letter input
Backspace
Enter key

Input populates current active row.

---

## ApplyPatternButton

Enabled when

All tiles in active row contain letters.

On click

1. Generate pattern
2. Send API request
3. Receive suggestions
4. Show suggestion sheet

---

# Suggestions Bottom Sheet

A sliding panel that appears from the bottom of the screen after pattern submission.

Built using Framer Motion.

Behavior

Hidden by default
Slides up after solver response
Can be dismissed by swipe or close button

Height

~50% screen height

---

# Suggestion Item

Each suggestion displays

Rank number
Word
Information score visualized as bar

Example

stunk  ████████
stony  ██████
stock  █████

Bars are scaled relative to maximum entropy value in response list.

---

# State Management

Core state

```
board
sessionId
remainingSolutions
suggestions
history
isSheetOpen
```

---

# Game Flow

1 Start Session

Frontend generates session id and calls

POST /start

Receives initial suggestions.

2 User Types Guess

Keyboard fills active row.

3 User Clicks Tiles

User cycles colors until pattern matches real Wordle response.

4 Apply Pattern

Frontend converts colors to pattern string.

Calls

POST /predict_next_word

5 Solver Response

Receives

remaining_count
best_guesses
history

6 Show Suggestions

Bottom sheet slides up displaying ranked guesses.

7 User Picks Next Guess

Either manually type
or tap suggestion to autofill next row.

---

# Desktop Layout

Two column layout

Left
Word grid
Keyboard

Right
Suggestions panel

---

# Mobile Layout

Vertical layout

Header
Remaining count
Word grid
Apply button
Keyboard

Suggestions appear in bottom sheet.

---

# Animation

Suggestions sheet uses spring animation.

Pseudo code

```
<motion.div
 initial={{ y: "100%" }}
 animate={{ y: 0 }}
 transition={{ type: "spring", stiffness: 200 }}
/>
```

---

# Optional Enhancements

Tap suggestion to auto fill next guess
Copy share board
Dark mode toggle
Auto solve mode

---

# MVP Goal

Working interactive Wordle board
Session based solver integration
Bottom sheet suggestions
Mobile responsive layout
