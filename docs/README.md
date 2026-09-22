# Zenith

> A simple, lightweight task manager built from scratch with TypeScript and Python.

Zenith is a small full-stack task management application focused on learning and understanding how a frontend, HTTP API, backend, and persistent storage fit together.

The project currently uses a **TypeScript frontend**, a **FastAPI backend**, and a **JSON file** for persistent task storage.

## Project Structure

```
zenith/
├── backend/                 # FastAPI server (Python)
│   ├── main.py
│   └── file_handler.py
├── frontend/                # Browser app (serve this folder)
│   ├── index.html
│   ├── configure.html
│   ├── statistics.html
│   ├── styles/
│   │   └── style.css
│   ├── audio/
│   │   └── alarm.mp3
│   ├── components/
│   │   ├── TaskItem.ts
│   │   └── TaskItem.js
│   ├── main.ts / main.js
│   ├── api.ts / api.js
│   ├── configure.ts / configure.js
│   ├── settings.ts / settings.js
│   └── types.ts / types.js
├── data/                    # Persistent storage
│   └── tasks.json
└── docs/
    ├── README.md
    └── notes.txt
```

The `.js` files are compiled output from the `.ts` files and can be regenerated with `tsc` (see `.gitignore`).

## Running

### Backend

```sh
cd backend
uvicorn main:app --reload
```

### Frontend

Serve `frontend/` with any static server (e.g. the VS Code Live Server extension) and open `index.html`. The TypeScript runs directly via ES module `<script type="module">` tags in the browser.

## Features

* A bunch of things I need to update lol

## Tech Stack

### Frontend

* HTML
* CSS
* TypeScript
* JavaScript

### Backend

* Python
    * FastAPI
    * Pydantic
    * Uvicorn