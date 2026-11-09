require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));

// Log the timestamp, HTTP method, and requested endpoint for every request.
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// MongoDB document structure for each item.
const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [1, "Name cannot be empty"]
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "items"
  }
);

const Item = mongoose.model("Item", itemSchema);

const isValidId = (id) => mongoose.isValidObjectId(id);

function validateItemBody(body, partial = false) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "Request body must be a JSON object";
  }

  const allowedFields = ["name", "description", "completed"];
  const unknownFields = Object.keys(body).filter(
    (field) => !allowedFields.includes(field)
  );

  if (unknownFields.length > 0) {
    return `Unsupported field(s): ${unknownFields.join(", ")}`;
  }

  if (partial && Object.keys(body).length === 0) {
    return "Provide at least one field to update";
  }

  if (
    Object.prototype.hasOwnProperty.call(body, "name") &&
    (typeof body.name !== "string" || body.name.trim().length === 0)
  ) {
    return "name must be a non-empty string";
  }

  if (
    Object.prototype.hasOwnProperty.call(body, "description") &&
    typeof body.description !== "string"
  ) {
    return "description must be a string";
  }

  if (
    Object.prototype.hasOwnProperty.call(body, "completed") &&
    typeof body.completed !== "boolean"
  ) {
    return "completed must be true or false";
  }

  return null;
}

// GET /api/items - return all items stored in MongoDB.
app.get("/api/items", async (req, res, next) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
});

// GET /api/items/:id - find one item by its MongoDB ObjectId.
app.get("/api/items/:id", async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: "Invalid item ID" });
    }

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
});

// POST /api/items - validate the body and save a new document.
app.post("/api/items", async (req, res, next) => {
  try {
    const validationError = validateItemBody(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    if (typeof req.body.name !== "string" || !req.body.name.trim()) {
      return res.status(400).json({ error: "name is required" });
    }

    const item = await Item.create({
      name: req.body.name,
      description: req.body.description ?? "",
      completed: req.body.completed ?? false
    });

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

// PUT /api/items/:id - update only the fields included in the request body.
app.put("/api/items/:id", async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: "Invalid item ID" });
    }

    const validationError = validateItemBody(req.body, true);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/items/:id - permanently delete the matching MongoDB document.
app.delete("/api/items/:id", async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: "Invalid item ID" });
    }

    const deletedItem = await Item.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json({
      message: "Item deleted",
      item: deletedItem
    });
  } catch (error) {
    next(error);
  }
});

// Handle malformed JSON bodies.
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON request body" });
  }
  next(err);
});

// Handle validation errors and unexpected errors.
app.use((err, req, res, next) => {
  if (err.name === "ValidationError" || err.name === "CastError") {
    return res.status(400).json({ error: err.message });
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

async function startServer() {
  if (!process.env.MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is missing. Copy .env.example to .env and add your MongoDB Atlas connection string."
    );
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Unable to start the API:", error.message);
  process.exit(1);
});
