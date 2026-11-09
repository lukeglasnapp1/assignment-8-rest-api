# Endpoint Testing Evidence

## Before testing

1. Complete the MongoDB Atlas setup in `README.md`.
2. Create your local `.env` file with a valid `MONGODB_URI`.
3. Run `npm install`, then `npm start`.
4. Confirm the terminal says `Connected to MongoDB`.
5. Open `requests.http` in VS Code with the REST Client extension, or use Postman.

## Requests and expected results

| Test | Method and route | Expected status | What it checks |
|---|---|---:|---|
| Get all items | GET `/api/items` | 200 | Reads the collection from MongoDB |
| Create item | POST `/api/items` | 201 | Inserts a new MongoDB document |
| Get one item | GET `/api/items/:id` | 200 | Finds a document by its MongoDB ObjectId |
| Update item | PUT `/api/items/:id` | 200 | Updates supplied fields in the saved document |
| Delete item | DELETE `/api/items/:id` | 200 | Deletes the document from MongoDB |
| Missing item | GET `/api/items/000000000000000000000000` | 404 | Returns not found for a valid but absent ObjectId |
| Invalid ID | GET `/api/items/not-an-object-id` | 400 | Rejects an invalid MongoDB ID |

## Evidence to capture for Canvas

Run each endpoint and capture the response/status code in Thunder Client, REST Client, or Postman. Paste your actual screenshots below or attach them in Canvas. Do not mark a test complete until you have run it.

- [ ] GET all items — attach actual response screenshot
- [ ] POST new item — attach actual 201 response screenshot
- [ ] GET item by ID — attach actual response screenshot
- [ ] PUT item — attach actual updated document screenshot
- [ ] DELETE item — attach actual deletion response screenshot
- [ ] Missing item — attach actual 404 response screenshot

## Persistence check

After creating an item, restart the server and run GET `/api/items` again. The created document should still be present because it is stored in MongoDB Atlas rather than an in-memory array.

**Important:** The status codes above are expected results. Actual evidence must be collected by running the API against your configured database.
