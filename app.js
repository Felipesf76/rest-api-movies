const express = require('express')
const crypto = require('node:crypto')
const moviesJSON = require('./model/movies.json')
const cors = require('cors')
const { validateMovie, validatePartialMovie } = require('./schema/movies.js')

const PORT = process.env.PORT ?? 1234

const app = express()

app.disable('x-powered-by')

app.use(express.json())

app.use(
  cors({
    origin: (origin, callback) => {
      const ACEPTED_ORIGINS = [
        'http://localhost:8080',
        'http://localhost:8081',
        'http://192.168.50.251:8080'
      ]
      if (ACEPTED_ORIGINS.includes(origin)) {
        return callback(null, true)
      }
      if (!origin) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed CORS'))
    }
  })
)

app.get('/movies', (req, res) => {
  const { generos } = req.query
  if (generos) {
    const filterMovies = moviesJSON.filter(movies =>
      movies.generos.some(movie => movie.toLowerCase() === generos.toLowerCase())
    )
    return res.json(filterMovies)
  }
  res.json(moviesJSON)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = moviesJSON.find(movie => movie.id === id)
  if (movie) return res.json(movie)
  res.status(404).json({ error: 'No se encontró la pelicula' })
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }

  moviesJSON.push(newMovie)
  res.status(201).json(newMovie)
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = moviesJSON.findIndex(movie => movie.id === id)
  if (movieIndex === -1) return res.status(400).json({ message: 'Movie not found' })

  moviesJSON.splice(movieIndex, 1)

  return res.json({ message: 'Movie deleted' })
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = moviesJSON.findIndex(movie => movie.id === id)
  if (movieIndex === -1) return res.status(400).json({ message: 'Movie not found' })

  const updateMovie = {
    ...moviesJSON[movieIndex],
    ...result.data
  }

  moviesJSON[movieIndex] = updateMovie

  res.json(updateMovie)
})

app.listen(PORT, () => {
  console.log(`App listening on port: http://localhost:${PORT}`)
})
