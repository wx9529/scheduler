# Interview Scheduler

# Netlify Link

https://production--super-macaron-02eb31.netlify.app

The client connects with a WebSocket server to allow persistent connection, open a new client for a realtime experience. 

## Project Description

Interview Scheduler is a SPA (Single Page Application) for tracking students interviews built with the latest tools and techniques for optimized user experience. The App utilizes React built-in and custom hooks and allows users to add, edit and delete appointments in real time. Data is persisted by the API server using a PostgreSQL database. The client application communicates with an API server over HTTP, using the JSON format. The interview scheduler client application connects with a WebSocket server to allow for a realtime experience. For quality assurance, the project follows best practices of TDD (Test Driven Development), where individual Components are tested in isolation as well as End-to-End testing is performed.

## Project Features

- Appointment days (Monday to Friday) are displayed and colour-coordinated depending on availability
- The days show the number of slots available as a snapshot of the week
- A user can switch between days and see detailed information
- Booked and available slots are clearly differentiated
- A user can book interviews by typing in a student name and clicking on an interviewer from a list of interviewers
- A user can change the details of an existing interview by pressing the edit icon
- A user can cancel an existing interview, a pop-up message will ask to confirm the action before permanently deleting an interview
- Days display currently remaining spots and capture updates after each modification

## Project View
WebSockets are supported in this application. Open a second browser window or tab to see changes made live!
![photo1](https://github.com/wx9529/scheduler/blob/master/docs/photo2.png?raw=true)
![photo2](https://github.com/wx9529/scheduler/blob/master/docs/photo3.png?raw=true)
![photo3](https://github.com/wx9529/scheduler/blob/master/docs/photo4.png?raw=true)

## Setup

Install dependencies with `npm install`.

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```
## API server/*Database

The Server has been pushed to Heroku, it only supports three GET endpoints on the server. The / path will return a 404 error.

- https://interview-scheduler95.herokuapp.com/api/days
- https://interview-scheduler95.herokuapp.com/api/appointments
- https://interview-scheduler95.herokuapp.com/api/interviewers

## Project Stack

Front-End: React, Axios, JSX, HTML, SASS, JavaScript

Back-End: Express, Node.js, PostgreSQL

Testing: Storybook, Webpack Dev Server, Jest, Testing Library and Cypress

## Dependencies

- Axios
- Classnames
- Normalize.css
- React
- React-dom
- React-scripts
- Babel/core
- Storybook/addon-actions
- Storybook/addon-backgrounds
- Storybook/addon-links
- Storybook/addons
- Storybook/react
- Testing-library/jest-dom
- Testing-library/react
- Testing-library/react-hooks
- Babel-loader
- Node-sass
- Prop-types
- React-test-renderer
