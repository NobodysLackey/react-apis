import { POSTER_PATH } from '../globals'

const MovieList = ({ movies, viewMore }) => {

  return (
    <div className="grid">
      {movies.map((movie) => (
        <div key={movie.id} className="card">
          <img src={`${POSTER_PATH}${movie.poster_path}`} alt="poster" />
          <h3>{movie.title}</h3>
          <button onClick={() => viewMore(movie.id)}>View Movie</button>
        </div>
      ))}
    </div>
  )
}

export default MovieList
