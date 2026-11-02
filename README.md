# Assignment 8 - Node.js and Express REST API

## Description

This project is a basic REST API built with Node.js and Express. It manages an in-memory collection of resources. Each resource has an ID, a name, and a completed status.

## Requirements

- Node.js and npm
- Express

## Setup

1. Clone this repository.
2. Open the project folder in a terminal.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the server:

   ```bash
   npm start
   ```

The server runs at http://localhost:3000.

## API Endpoints

| Method | Endpoint | Description | Success status |
|---|---|---|---|
| GET | `/api/resources` | Get all resources | 200 |
| GET | `/api/resources/:id` | Get one resource | 200 |
| POST | `/api/resources` | Create a resource | 201 |
| PUT | `/api/resources/:id` | Replace a resource's fields | 200 |
| DELETE | `/api/resources/:id` | Delete a resource | 200 |

### Example resource

```json
{
  "id": 1,
  "name": "Study for exam",
  "completed": false
}
```

### POST and PUT request body

```json
{
  "name": "Practice API testing",
  "completed": false
}
```

The API validates the name and completed value. It returns 400 for invalid input and 404 when a requested ID does not exist.

## Middleware

- `express.json()` parses JSON request bodies.
- A custom middleware logs the timestamp, HTTP method, and requested URL.
- Error-handling middleware returns a useful response for invalid JSON and unexpected server errors.

## Notes

Data is stored in memory, so changes are reset when the server restarts. This project is intended as a basic REST API assignment and does not use a database.
