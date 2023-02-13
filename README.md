# Family tree app
Full stack application, that allows users to create own family tree and interact with each other.

## Technologies
Project is created with:

- vue version: 3.2.45
- typescript version: 4.7.4
- express version: 2.8.0
- express version: 4.18.2
- neo4j version: 5-enterprise
- mongo version: 6.0.4
- socket.io version: 4.5.4
- tailwindcss version: 3.2.4
- passport version: 0.6.0
- jsonwebtoken version: 9.0.0

## Setup
To run this project, go to current project directory and run using:

``
$ docker-compose up -d
``

## Description
The project is full stack application, that provides the ability to manage user's own family tree, chat between multiple users in private rooms, chat with all users in public chat and view the family tree of other users.

Backend is created in a microservices architecture.
Everything is secured with passport using jsonwebtoken.