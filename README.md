# motorola-sol

Node.js API for Books and Authors with Docker

# Overview
This Node.js application provides RESTful APIs to manage books and authors. It includes endpoints for retrieving, creating, updating, and deleting both books and authors. The application is containerized using Docker for efficient deployment and management.

# Database
The application utilizes a relational database with two primary tables:

Authors: Stores information about authors, including:
id (primary key)
name
birth_year (optional)
biography (optional)

Books: Stores information about books, including:
id (primary key)
title
publication_year
description (optional)
author_id (foreign key referencing id in Authors)

# Endpoints
The API exposes the following endpoints:

Books

GET /books: Retrieves a list of all books with their corresponding author information. This endpoint retrieves books and authors separately, then joins them based on the author_id for each book.
POST /books: Creates, updates, or deletes a book based on the provided data. The request body must include an operation field specifying the desired action (insert, update, or delete) and relevant book data. For new books, an author_id is required.

Authors

GET /authors: Retrieves a list of all authors.
POST /authors: Creates, updates, or deletes an author based on the provided data. The request body must include an operation field specifying the desired action (insert, update, or delete) and relevant author data.

# POST Request Body Structure
The request body for POST operations should have the following structure:

JSON
{
  "operation": "insert" | "update" | "delete",
    // Book or author data based on the endpoint
}

# Example POST Request for Book
JSON
{
    "operation": "insert",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald"
    "publicationYear": 1925
}

# Technology Stack
Node.js
Express.js
Database SQLite
Docker
Postman (for API testing)

# Installation
Clone this repository.
Install dependencies using npm install.
Configure database connection details.
Build the Docker image: docker-compose build
Start the containers: docker-compose up

## Run the application
node app

# Docker Compose
## Note this does not work
The docker-compose.yml file defines the services for the application. It includes:
node-application: The main application container.
db: The database container