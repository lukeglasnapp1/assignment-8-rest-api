# Database-Backed Express REST API

## Description

This project extends the earlier Express REST API by using **MongoDB Atlas** to store data permanently. The API no longer uses an in-memory array. Items are saved as documents in the MongoDB `items` collection, so changes remain after the server restarts.

Each item has:
- `_id`: unique MongoDB document identifier
- `name`: required string
- `description`: optional string (defaults to an empty string)
- `completed`: boolean (defaults to `false`)
- `createdAt` and `updatedAt`: timestamps added by Mongoose

## Requirements

- Node.js 18 or newer
- npm
- A MongoDB Atlas cluster and database user

## MongoDB Atlas setup

1. Sign in to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free cluster if you do not already have one.
2. Create a database user with a username and password.
3. In **Network Access**, allow your current IP address.
4. Select **Connect > Drivers**, choose Node.js, and copy the connection string.
5. In the project folder, copy `.env.example` to a new file named `.env`.
6. Replace the placeholder in `MONGODB_URI` with your Atlas connection string. Include your database name, for example `assignment9`, before the query parameters.
7. Do not commit or share the `.env` file. It is excluded by `.gitignore`.

Example local configuration:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER/assignment9?retryWrites=true&w=majority
PORT=3000
```

URL-encode special characters in the database password when required.

## Install and start

```bash
npm install
npm start
```

When the connection succeeds, the terminal prints `Connected to MongoDB` and the API listens at `http://localhost:3000`.

## API endpoints

| Method | Endpoint | Description | Success status |
|---|---|---|---|
| GET | `/api/items` | Return all items from MongoDB | 200 |
| GET | `/api/items/:id` | Return one item by MongoDB ObjectId | 200 |
| POST | `/api/items` | Validate and insert a new item | 201 |
| PUT | `/api/items/:id` | Update supplied fields on an existing item | 200 |
| DELETE | `/api/items/:id` | Permanently delete an item | 200 |

### Example POST body

```json
{
  "name": "Study for operating systems",
  "description": "Review synchronization and deadlocks",
  "completed": false
}
```

### Example partial PUT body

```json
{
  "completed": true
}
```

The API returns `400 Bad Request` for invalid IDs or invalid request data, and `404 Not Found` when a valid ID does not match a stored item.

## Implementation details

- Express parses JSON request bodies with `express.json()`.
- A custom middleware logs the timestamp, HTTP method, and URL for every request.
- Mongoose defines and validates the item document schema.
- All five routes read or write directly to MongoDB using Mongoose queries.
- The database connection is read from an environment variable instead of being hard-coded.
- Error-handling middleware returns useful client errors and a generic response for unexpected server errors.

## Testing

Open `requests.http` in VS Code with the REST Client extension installed. Follow the instructions in [TESTING.md](TESTING.md). Add your own screenshots or copied responses to the Canvas submission after running the requests against your Atlas database.
