// Maps HTTP methods + URL paths to controller functions.
const express = require("express");
const router = express.Router();

const { getEvents, getEventById } = require("../controllers/events");
const requireAuth = require("../middleware/requireAuth");

// GET /events: lists events (with optional city/date filters)
router.get("/", getEvents);

// GET /events/:id: single event details
router.get("/:id", getEventById);

module.exports = router;