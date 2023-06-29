import axios from 'axios'
import { useState, useEffect } from 'react'
import { BASE_URL, API_KEY } from '../globals'
import { POSTER_PATH } from '../globals'

const MovieDetails = ({ selectedMovie, setSelectedMovie }) => {
  const [movieDetails, setMovieDetails] = useState({})

  useEffect(() => {
    const getMovieDetails = async () => {
      const response = await axios.get(
        `${BASE_URL}/movie/${selectedMovie}?api_key=${API_KEY}`
      )
      setMovieDetails(response.data)
    }

    getMovieDetails()
  }, [selectedMovie])

  return (
    <div className="details">
      <h1 className="content">{movieDetails.original_title}</h1>
      <img src={`${POSTER_PATH}${movieDetails.backdrop_path}`} alt="poster" />
      <p className="content">{movieDetails.overview}</p>
      <button onClick={() => setSelectedMovie(null)}>Back</button>
    </div>
  )
}

export default MovieDetails
