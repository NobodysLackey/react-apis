import './App.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { BASE_URL, API_KEY } from './globals'
import MovieList from './components/MovieList'
import MovieDetails from './components/MovieDetails'

const App = () => {
  const [movies, setMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)

  useEffect(() => {
    const getMovies = async () => {
      const response = await axios.get(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}`
      )
      setMovies(response.data.results)
    }
    getMovies()
  }, [])

  const viewMore = (movieId) => {
    setSelectedMovie(movieId)
  }

  let details = selectedMovie ? <MovieDetails setSelectedMovie={setSelectedMovie} selectedMovie={selectedMovie} /> : <MovieList viewMore={viewMore} movies={movies} />

  return <div>{details}</div>
}

export default App
