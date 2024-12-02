# Resonate

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Postgres](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)](https://sequelize.org/)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

## Overview

Resonate is a platform that allows audio professionals to work with their clients with ease. The platform allows for project creation and management, and lets you create and manage clients. This way you won't have to worry about losing any clients!

## Features

* Project creation and management
* Client creation and management
* Secure authentication and authorization using JSON Web Tokens (JWT)

## Technology Stack

* Frontend: React, React Router, Redux
* Backend: Express, Sequelize, PostgreSQL, SQLite
* ORM: Sequelize
* Database: PostgreSQL (production), SQLite (development)

## MVP Database Schema
![Database Schema](/images/resonate_db_schema.png)

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

## Installation

1. Clone the repository: `git clone https://github.com/izzymadethat/resonate.git`
2. Install dependencies in both folders: `npm install`
3. Start the development server: `npm start`

## Contributing

Contributions are welcome! Please submit a pull request with your changes.

## License

This project is licensed under the ISC License.

## Acknowledgments

This project was submitted as a capstone for my App Academy Graduation.