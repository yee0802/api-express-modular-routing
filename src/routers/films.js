const express = require("express");
const router = express.Router();

const films = require("../../data/index").films;

let filmId = 4;

const findFilmById = (req, res) => {
  const filmId = Number(req.params.id);

  const foundFilm = films.find((film) => film.id === filmId);

  if (!foundFilm) {
    res.status(404).send({ error: `No film found with ID: ${filmId}` });
  }

  return foundFilm;
};

router.get("/", (req, res) => {
  const director = req.query.director;

  if (director) {
    const foundFilms = films.filter(
      (film) =>
        film.director.replace(/\s+/g, "").toLowerCase() ===
        director.toLowerCase()
    );

    if (!foundFilms) {
      return res
        .status(404)
        .send({ error: `No film found with director: ${director}` });
    }

    return res.status(200).send({ films: foundFilms });
  }

  return res.status(200).send({ films: films });
});

router.post("/", (req, res) => {
  const { title, director } = req.body;

  if (!title || !director) {
    return res
      .status(400)
      .send({ error: "Please provide a title and director" });
  }

  const titleExists = films.some((film) => film.title === title);

  if (titleExists) {
    return res.status(409).send({ error: "Title already exists" });
  }

  const newFilm = {
    director: director,
    title: title,
    id: ++filmId,
  };

  films.push(newFilm);

  res.status(201).send({ film: newFilm });
});

router.get("/:id", (req, res) => {
  const foundFilm = findFilmById(req, res);

  if (foundFilm) {
    return res.status(200).send({ film: foundFilm });
  }

  return foundFilm;
});

router.delete("/:id", (req, res) => {
  const foundFilm = findFilmById(req, res);

  if (foundFilm) {
    const filmIndex = films.indexOf(foundFilm);

    films.splice(filmIndex, 1);

    return res.status(200).send({ film: foundFilm });
  }

  return foundFilm;
});

router.put("/:id", (req, res) => {
  const foundFilm = findFilmById(req, res);
  const { title, director } = req.body;

  if (!title || !director) {
    return res
      .status(400)
      .send({ error: "Please provide a title and director" });
  }

  const titleExists = films.some((film) => film.title === title);

  if (titleExists) {
    return res.status(409).send({ error: "Title already exists" });
  }

  if (foundFilm) {
    const filmIndex = films.indexOf(foundFilm);

    const updatedFilm = {
      director: director,
      title: title,
      id: foundFilm.id,
    };

    films[filmIndex] = updatedFilm;

    return res.status(200).send({ film: updatedFilm });
  }

  return foundFilm;
});

router.patch("/:id", (req, res) => {
  const foundFilm = findFilmById(req, res);
  const body = req.body;

  if (!body.title && !body.director) {
    return res
      .status(400)
      .send({ error: "Please provide a title or director" });
  }

  const titleExists = films.some((film) => film.title === body.title);

  if (titleExists) {
    return res.status(409).send({ error: "Title already exists" });
  }

  if (foundFilm) {
    const filmIndex = films.indexOf(foundFilm);

    const updatedFilm = {
      ...foundFilm,
      ...body,
      id: foundFilm.id,
    };

    films[filmIndex] = updatedFilm;

    return res.status(200).send({ film: updatedFilm });
  }

  return foundFilm;
});

module.exports = router;
