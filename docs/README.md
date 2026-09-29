# Zenith

> A simple, lightweight task manager built from scratch with TypeScript and Python.

Zenith is a small full-stack task management application focused on learning and understanding how a frontend, HTTP API, backend, and persistent storage fit together.

## Why the name "Zenith"?
In simple terms it means the highest point of something. For example, when I say the Sun is at it's Zenith, it is meant that the Sun is right above me, at it's highest percieved height.
For me, Zenith is a tool for learning and also aiding me in providing a workflow I can function with, in other words, Zenith is a project that is meant to aid me in reaching my highest point, not only as a programmer but also as a person using it.

## Features
### Global Stopwatch-based time tracking
Zenith divides work sessions by *cycles*, which is the minimal block of time used for a unit of work. It can vary per person or energy level, inspired by Pomodoro basically.
	For example I can set my cycle period to be 15 minutes for a quick session of adding comments.
		Or maybe 30 for a deeper feature implementation?
Once the cycle is over, a dialog appears with a prompt (The current *cycle message*, which you can also configure), reminding you to do something after the cycle, e.g: Stretch, drink water.
You have the option to enter the *InterCycle Period*, which is basically a pause timer you set in seconds. This is dedicated for the execution of the cycle message prompt and extra stuff you might want. 

### Quick task editing
When you press the 'view info' button, you also have the option to directly change information for the task in the same dialog.

### Task Time Tracking
When you click execute in a task, a stopwatch appears registering how much time you've spent on that task. This time is saved for future reference until the task is finished/deleted.

### Data persistence
#### JSON (Ephemeral)
This project Currently uses JSON, managed by the Python Backend, to store the tasks. 
The only reason for such is to make things easier for me to manage during these early stages.
In the future, Zenith will boast a dedicated DB, however this is not in any of my priorities right now.

##### LocalStorage (Possibly Ephemeral)
For settings and the registere d Stopwatch time, Zenith stores then in localStorage, which means it is relative to the browser you use.
This is a more native solution than the previously mentioned JSON, however due to plans of scaling for cross-platform data sync, localStorage may be replaced for another DB.


### (Upcoming) Statistics page
#### Value Metrics
I've always believed that your performance is directly related to who you are. With this in mind, I have plans to integrate into Zenith a Radar Chart that represents your alignment to custom made metrics such as:
- Faith
- Socials
- Self-Control
And those metrics get a daily evaluation to compare over time, forming an average radar chart.

### (Upcoming) Goals page
A simple goal tracker for each Quarter of the Year, for strategic thinking.


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

## PS: 
You might have noticed a lot of things in this project are not common to others, and that has a reason for it.
*Zenith is meant to be my custom tool!*
It is developed from the experience of years of improductivity and distraction. Across my experience I've learned what works for me, and how seeing time passing by actually aids me into a more focused state.
This project *Might Not work for you!* Even though I've designed it to hard-code as less stuff as possible (Hence why the config page), maybe my methodology does NOT match your workflow!
However, even if Zenith doesn't fulfill your needs for a task manager, I'd appreciate it if you shifted perspective from a task-manager to a learning project, so that you can engage with it better.

