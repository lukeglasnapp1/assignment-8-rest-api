# API Testing

Start the API with `npm start` before running these commands in another terminal. The examples use curl and assume the server is running at `http://localhost:3000`.

## 1. Get all resources

```bash
curl -i http://localhost:3000/api/resources
```

Expected status: `200 OK`

## 2. Get one resource

```bash
curl -i http://localhost:3000/api/resources/1
```

Expected status: `200 OK`

## 3. Create a resource

```bash
curl -i -X POST http://localhost:3000/api/resources -H "Content-Type: application/json" -d '{"name":"Practice API testing","completed":false}'
```

Expected status: `201 Created`

## 4. Update a resource

```bash
curl -i -X PUT http://localhost:3000/api/resources/1 -H "Content-Type: application/json" -d '{"name":"Study for final","completed":true}'
```

Expected status: `200 OK`

## 5. Delete a resource

```bash
curl -i -X DELETE http://localhost:3000/api/resources/2
```

Expected status: `200 OK`

## 6. Test a missing resource

```bash
curl -i http://localhost:3000/api/resources/999
```

Expected status: `404 Not Found`

## Test evidence to add before submission

Run each command and paste the actual terminal response or add screenshots below. The status codes above are expected results, not recorded test evidence.

- [ ] GET all resources
- [ ] GET one resource
- [ ] POST resource
- [ ] PUT resource
- [ ] DELETE resource
- [ ] 404 for missing resource

## Notes

The resources are stored in memory. Restarting the server resets the collection.
