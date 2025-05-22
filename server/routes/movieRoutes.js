const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");
const { protect, adminOnly } = require("./authRoutes");

// Получить все фильмы
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Получить фильмы категории trending
router.get("/category/trending", async (req, res) => {
  try {
    const movies = await Movie.find({ type: "trending" });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Получить фильмы категории popular
router.get("/category/popular", async (req, res) => {
  try {
    const movies = await Movie.find({ type: "popular" });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Получить фильмы категории newReleases
router.get("/category/newReleases", async (req, res) => {
  try {
    const movies = await Movie.find({ type: "newReleases" });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Общий маршрут для получения фильмов по категории
router.get("/category/:type", async (req, res) => {
  try {
    const movies = await Movie.find({ type: req.params.type });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Получить фильм по ID
router.get("/:id", getMovie, (req, res) => {
  res.json(res.movie);
});

// Добавить новый фильм (только для админов)
router.post("/", protect, adminOnly, async (req, res) => {
  const movie = new Movie(req.body);

  try {
    const newMovie = await movie.save();
    res.status(201).json(newMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Обновить фильм (только для админов)
router.patch("/:id", protect, adminOnly, getMovie, async (req, res) => {
  Object.keys(req.body).forEach((key) => {
    res.movie[key] = req.body[key];
  });

  try {
    const updatedMovie = await res.movie.save();
    res.json(updatedMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Удалить фильм (только для админов)
router.delete("/:id", protect, adminOnly, getMovie, async (req, res) => {
  try {
    await res.movie.deleteOne();
    res.json({ message: "Фильм удален" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware для получения фильма по ID
async function getMovie(req, res, next) {
  let movie;
  try {
    movie = await Movie.findById(req.params.id);
    if (movie == null) {
      return res.status(404).json({ message: "Фильм не найден" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.movie = movie;
  next();
}

module.exports = router;
