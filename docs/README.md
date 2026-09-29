# Zenith

> A simple, lightweight task manager built from scratch with TypeScript and Python.

Zenith is a small full-stack task management application built as both a personal productivity tool and a learning project.

The project focuses on understanding how a frontend, HTTP API, backend, and persistent storage fit together while building something I can actually use.

## Why "Zenith"?

**Zenith** refers to the highest point of something. For example, when the Sun is at its zenith, it is at its highest apparent position in the sky.

For me, Zenith represents the same idea: a tool designed to help me work toward my highest point, both as a programmer and as a person.

It is therefore not intended to be a generic productivity application. It is a tool built around my own workflow, experiences, and understanding of what helps me remain focused.

## Features

### Global Stopwatch-Based Time Tracking

Zenith divides work into **cycles**: configurable blocks of time dedicated to a unit of work.

The duration can be adapted to the type of work being performed.

For example:

* **15 minutes** for a quick task such as adding comments.
* **30 minutes** for deeper feature implementation.

When a cycle ends, Zenith displays the configured **cycle message**, reminding you to perform an action such as stretching or drinking water.

An optional **InterCycle Period** can also be configured. This provides a dedicated pause after each cycle for carrying out the cycle message and anything else that needs to happen before continuing.

### Quick Task Editing

The task information dialog also allows task information to be edited directly, without requiring a separate editing interface.

### Task Time Tracking

Executing a task starts a stopwatch that records how much time has been spent working on it.

The accumulated time remains associated with the task until it is completed or deleted.

### Data Persistence

#### JSON

Zenith currently uses JSON, managed by the Python backend, for task persistence.

This is intentionally simple for the current stage of development. A dedicated database is planned eventually, but introducing one is not currently a priority.

#### LocalStorage

Settings and registered stopwatch time are currently stored in browser `localStorage`.

This is convenient for the current architecture because the data is local to the browser.

If Zenith eventually expands toward cross-platform synchronization, this storage model may be replaced by a database-backed solution.

## Upcoming

### Statistics

Zenith will eventually include a statistics page based around custom **value metrics**.

The idea is to track areas such as:

* Faith
* Social interaction
* Self-control

These metrics would be evaluated over time and visualized through a radar chart, allowing changes in the user's self-assessment to be observed across different periods.

This is intended as a personal reflection mechanism rather than an objective measurement of a person's worth or performance.

### Goals

A goals page is planned around **quarterly goals**, providing a higher-level layer for strategic planning alongside Zenith's day-to-day task management.

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

### Current Architecture

```text
Frontend
   │
   │ HTTP
   ▼
FastAPI Backend
   │
   ▼
JSON Storage
```

Browser-local settings and stopwatch state are currently handled separately through `localStorage`.

## Philosophy

Zenith is intentionally different from a conventional task manager.

It was developed from my own experiences with productivity, distraction, and time management. One of the things I've found useful is having a visible representation of time passing while working.

Because of that, Zenith is designed around my own methodology rather than trying to implement a universally applicable productivity system.

**Zenith might not work for you.**

Even though the application attempts to avoid hard-coding too much of my workflow through configurable settings, its underlying methodology is still personal.

If Zenith does not fit your workflow as a task manager, I would instead encourage you to view it as what it also is:

> **A learning project built around a real problem.**

The goal is not simply to produce another task manager. The goal is to understand the engineering involved in building one while creating a tool that is genuinely useful to me.
