const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Parse incoming JSON request bodies.
app.use(express.json());

// Log each incoming request.
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// In-memory resource collection.
let resources = [
  { id: 1, name: "Study for exam", completed: false },
  { id: 2, name: "Finish assignment", completed: false }
];

let nextId = 3;

// GET all resources.
app.get("/api/resources", (req, res) => {
  res.status(200).json(resources);
});

// GET one resource by ID.
app.get("/api/resources/:id", (req, res) => {
  const id = Number(req.params.id);
  const resource = resources.find((item) => item.id === id);

  if (!resource) {
    return res.status(404).json({ error: "Resource not found" });
  }

  res.status(200).json(resource);
});

// CREATE a resource.
app.post("/api/resources", (req, res) => {
  const { name, completed = false } = req.body ?? {};

  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "A non-empty name is required" });
  }

  if (typeof completed !== "boolean") {
    return res.status(400).json({ error: "completed must be a boolean" });
  }

  const resource = {
    id: nextId++,
    name: name.trim(),
    completed
  };

  resources.push(resource);
  res.status(201).json(resource);
});

// UPDATE a resource by ID.
app.put("/api/resources/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = resources.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Resource not found" });
  }

  const { name, completed = false } = req.body ?? {};

  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "A non-empty name is required" });
  }

  if (typeof completed !== "boolean") {
    return res.status(400).json({ error: "completed must be a boolean" });
  }

  resources[index] = {
    id: resources[index].id,
    name: name.trim(),
    completed
  };

  res.status(200).json(resources[index]);
});

// DELETE a resource by ID.
app.delete("/api/resources/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = resources.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Resource not found" });
  }

  const [deletedResource] = resources.splice(index, 1);
  res.status(200).json({
    message: "Resource deleted",
    resource: deletedResource
  });
});

// Handle malformed JSON with a clear client error.
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON" });
  }
  next(err);
});

// General fallback for unexpected server errors.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
