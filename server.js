const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRouter=require("./routes/auth");
require("dotenv").config();
const Movie = require("./model/Movie");
const auth=require("./middleware/auth");
const adminRouter=require("./routes/admin");

const app = express();


app.use(cors({
  origin: ["http://localhost:5173", "https://movieappimd.netlify.app"],
  credentials: true
}));


// app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// then your routes
app.use("/auth",authRouter);
app.use("/admin",adminRouter);


// -------------------- Routes --------------------

// GET all movies
app.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET sorted movies
app.get("/movies/sorted", async (req, res) => {
  const { by } = req.query;
  let sortObj = {};
  switch (by) {
    case "name":
      sortObj = { title: 1 };
      break;
    case "rating":
      sortObj = { imDbRating: -1 };
      break;
    case "releaseDate":
      sortObj = { year: -1 };
      break;
    case "rank":
      sortObj = { rank: 1 };
      break;
    default:
      sortObj = {};
  }

  try {
    const movies = await Movie.find().sort(sortObj);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET search movies by title or crew
app.get("/movies/search", async (req, res) => {
  const { query } = req.query;
  try {
    const movies = await Movie.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { crew: { $regex: query, $options: "i" } },
      ],
    });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add movie
app.post("/movies",adminRouter,async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    await newMovie.save();
    res.status(201).json(newMovie);
    
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT edit movie by _id
app.put("/movies/:id",auth('Admin'),async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE movie by _id
app.delete("/movies/:id", auth('Admin'),async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "Movie deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// -------------------- Connect MongoDB --------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
