# Multimedia Tracker

A comprehensive multimedia tracker app that helps users organize, track, and discover new content across books, films, and TV shows. This project aims to solve the frustrations associated with managing media across multiple platforms by integrating a seamless, all-in-one solution with features like personalized recommendations and social engagement.

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Tech Stack](#tech-stack)
6. [API Integration](#api-integration)
7. [File Structure](#file-structure)
8. [Personas](#personas)
9. [Future Plans](#future-plans)
10. [Contributors](#contributors)
11. [License](#license)

## Introduction

Multimedia Tracker simplifies the process of tracking books, films, and TV shows across multiple platforms. By consolidating your media lists into one place, it helps you keep track of everything you've watched, read, or plan to explore in the future. Users can also receive AI-driven recommendations based on their tastes and preferences.

### Problem Statement

Tracking and organizing media (books, films, TV shows) across multiple platforms is inefficient for media enthusiasts. The process is fragmented, lacks personalized recommendations, and misses crucial social engagement features.

**Who it affects:**  
Young, tech-savvy media consumers who want an all-in-one solution to track their content, discover new releases, and share recommendations with friends.

## Features

- **Media Tracking**: Log books, movies, and TV shows, with CRUD functionalities (Create, Read, Delete).
- **Personalized Recommendations**: AI-powered recommendations using OpenAI's API.
- **User Authentication & Authorization**: Secure user login and account management.
- **Modularized Backend**: Designed with Node.js and Express for flexibility and ease of expansion.
- **Social Sharing & Engagement**: Integrated sharing and recommendation features (Planned).
- **Responsive UI**: Built with React and MUI for a fluid, modern user interface.
- **Performance Monitoring**: Utilizes tools like `morgan` and `helmet` for efficient backend performance.
  
### Competitor Analysis

I've conducted a thorough SWOT analysis against competitors like **Goodreads**, **Libib**, and **Trakt** to identify gaps in their offerings and enhance the Multimedia Tracker's features.

## Installation


### Frontend Setup

1. Navigate to the `frontend` directory.

2. Install dependencies:

   `npm install`

1.  Start the development server:

    `npm start`

### Backend Setup

1.  Navigate to the `backend` directory.

2.  Install dependencies:

    `npm install`

3.  Run the backend server with nodemon:

    `npm run dev`

### Usage

Once both the frontend and backend are running, you can:

1.  Create an account and log in.
2.  Start adding books, films, and TV shows to your personal tracker.
3.  Receive recommendations from the AI and manage your multimedia library.

### Tech Stack

-   **Frontend**: React, React Router, MUI (Material UI), TailwindCSS
-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB for efficient document storage and handling.
-   **Authentication**: JWT-based authentication system with bcrypt for password encryption.
-   **APIs**: Integration with OpenAI for personalized recommendations.

### Key Libraries & Packages

-   **React Router DOM**: Simplifying client-side routing.
-   **Mongoose**: Elegant MongoDB object modeling.
-   **Helmet**: Secures Express apps by setting HTTP headers.
-   **Morgan**: HTTP request logger for better development and debugging.

### API Integration

The app integrates **OpenAI's API** to deliver personalized recommendations based on users' media preferences. This allows for more accurate and engaging suggestions to enhance the user experience.

### File Structure

The project is structured as a monorepo, with separate frontend and backend folders. Below is the detailed file structure:

#### Backend


`backend/
│
├── controllers/
│   ├── advisemeController.js
│   ├── authController.js
│   └── mediaController.js
│
├── models/
│   ├── Blacklist.js
│   ├── Media.js
│   └── User.js
│
├── routes/
│   ├── advisemeRoutes.js
│   ├── authRoutes.js
│   └── mediaRoutes.js
│
├── utils/
│   ├── auth.js
│   └── database.js
│
├── src/routes/
├── .env
├── .gitignore
├── adviseMe.js
├── Dockerfile
├── package.json
└── server.js`

#### Frontend


`frontend/
│
├── public/
├── src/
│   ├── components/
│   │   ├── adviseme.js
│   │   ├── App.js
│   │   ├── home.js
│   │   ├── index.js
│   │   ├── landingPage.js
│   │   ├── login.js
│   │   └── signup.js
│   ├── App.test.js
│   ├── App.css
│   ├── home.css
│   ├── index.css
│   └── tailwind.config.js
├── .babelrc
├── .gitignore
├── package.json
└── README.md`

### Personas

Based on user research, I've identified three main personas who benefit from the app:

1.  **Avid Reader/Film Buff**: Users who consume media regularly and are looking for deeper insights, personalized suggestions, and advanced tracking features.
2.  **Casual Binger**: Users who enjoy media but need a simple way to track what they watch or read and get periodic recommendations.
3.  **Organized Enthusiast**: Users who seek an all-in-one solution to manage and organize media across platforms and stay up-to-date with new releases.

### Future Plans

-   **Edit Functionality**: Currently, the app supports CRUD minus the update functionality. This is in progress and will allow users to edit their media entries.
-   **Frontend Refactoring**: Planning to modularize the React components for better scalability and maintainability.
-   **UI/UX Optimization**: Enhance the UI styling for a more polished user experience.
-   **Social Features**: Integrating social engagement tools so users can share their media lists and reviews with friends.

