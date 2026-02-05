const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Movie = require("../model/Movie");

// POST new movie
router.post("/movies", auth("ADMIN"), async (req, res) => {
  console.log("POST /movies payload:", req.body);
  try {
    const newMovie = new Movie(req.body);
    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (err) {
    console.error("Error saving movie:", err.message, err.errors);
    res.status(400).json({ message: err.message, errors: err.errors });
  }
});


// PUT update movie by ID
router.put("/movies/:id", auth("ADMIN"), async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedMovie)
      return res.status(404).json({ message: "Movie not found" });
    res.json(updatedMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE movie by ID
router.delete("/movies/:id", auth("ADMIN"), async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie)
      return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "Movie deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
