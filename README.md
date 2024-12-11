# Resonate

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Postgres](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)](https://sequelize.org/)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

## Overview
[![Resonate Motto](/images/motto.png)](https://resonate-hr8p.onrender.com)

Resonate is a platform that allows audio professionals to work with their clients with ease. The platform allows for project creation and management, and lets you create and manage clients. This way you won't have to worry about losing any clients!

![Resonate Overview Client View](/images/overview-1.png)
![Resonate Overview Projects View](/images/overview-2.png)

## Installation and Setup

1. Clone the repository: 
    ```bash
    git clone https://github.com/izzymadethat/resonate.git
    ```
    `via ssh`
    ```bash
    git clone git@github.com:izzymadethat/resonate.git
    ```
2. Install dependencies in both folders: `npm install`
    ```
    cd backend
    npm install
    cd ../frontend
    npm install
    ```
3. Start the development servers:
    - ***Pre-requisite:*** Make sure Docker is installed on your computer
    ```bash
    cd ... # or make sure you're in the ROOT directory
    docker compose up -d
    ```

4. Create environment variables in the backend directory (an example .env has been provided)
    ```bash
    cd backend
    cp .env.example .env # copies pre-existing .env.example into a new .env file that does NOT get uploaded to Github 
    ```
    - add the necessary environment variables to run the app in development.


## Features

* Project creation and management
* Client creation and management
* Upload, Store, Stream, and Manage Project Audio Files
* Secure authentication and authorization using JSON Web Tokens (JWT)

## Technology Stack

* Frontend: React, React Router, Redux
* Backend: Express, Sequelize, PostgreSQL, SQLite
* ORM: Sequelize
* Devops/Tooling: Docker, AWS
* Database: PostgreSQL (production), SQLite (development)

## MVP Database Schema
![Database Schema](/images/res_schema_0.1.0.png)

## Frontend Routes

* `/`: Home page
* `/projects`: Project list page
* `/projects/new`: Create new project page
* `/projects/:projectId`: View project page
* `/projects/:projectId/edit`: Edit project page
* `/clients`: Client list page
* `/clients/new`: Create new client page
* `/clients/:clientId`: View client page
* `/clients/:clientId/edit`: Edit client page

## API Routes

* GET `/api/projects`: Get all projects
* GET `/api/projects/:projectId`: Get project by ID
* POST `/api/projects`: Create new project
* PUT `/api/projects/:projectId`: Update project
* DELETE `/api/projects/:projectId`: Delete project
* GET `/api/clients`: Get all clients
* GET `/api/clients/:clientId`: Get client by ID
* POST `/api/clients`: Create new client
* PUT `/api/clients/:clientId`: Update client
* DELETE `/api/clients/:clientId`: Delete client
* GET `/api/session`: Get current user session
* POST `/api/session`: Create new user session
* DELETE `/api/session`: Delete user session

## Contributing

Contributions are welcome! Please submit a pull request with your changes.

## Acknowledgments

This project was submitted as a capstone for my App Academy Graduation.