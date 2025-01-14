import { useState, useEffect } from 'react';
import { getGenres } from '../services/openaiService'
import { getSpotifySongs } from '../services/spotifyService'
import { isUserAuthenticated } from '../utils/authUtils';
import Player from '../components/Player';
const Home = () => {
    const [mood, setMood] = useState("")
    const [genres, setGenres] = useState([])
    const [songs, setSongs] = useState([])
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [playingTrack, setPlayingTrack] = useState()

    const handleSubmit = async (e) => {
      // stay on same page without reloading
      e.preventDefault();
  
      try {
        const response = await getGenres(mood);
        console.log(response)
        const genreList = response.split(", ").map((genre) => genre.trim())
        console.log(genreList)
        setGenres(genreList);

        const allSongs = []
        for(const genre of genreList){
          const genreSongs = await getSpotifySongs(genre)
          console.log(genreSongs)
          allSongs.push(...genreSongs)
        }
        setSongs(allSongs)

        
      } catch (error) {
        console.error("Error fetching recommendation:", error);
        setGenres("Failed to get a recommendation.")
        setSongs([])
      }
    };

    const handlePlayingTrack = (trackUri) => {
      setPlayingTrack(trackUri)
    }

    useEffect(() => {
      setIsAuthenticated(isUserAuthenticated)
    }, []);

    return (
      <div>
        <h1>Music Recommender</h1>
        {isAuthenticated ? (
          <>
            <form onSubmit={handleSubmit}>
    
              <input 
                type="text" 
                placeholder="Enter your mood or feelings"  
                value={mood}  
                onChange={(e) => setMood(e.target.value)} 
                className="input input-bordered w-full max-w-xs" 
              />
              <button type='submit' className="btn btn-primary">Submit</button>
            </form>

            {genres.length > 0 && (
              <>
                <h2>Recommended Genres:</h2>
                <ul>
                  {genres.map((genre, index) => (
                    <li key={index}>{genre}</li>
                  ))}
                </ul>
              </>
             )}
       
            {songs.length > 0 && (
              <>
                <h2>Recommended Songs:</h2>
                <ul>
                  {songs.map((song) => (
                    <li key={`${song.id}-${song.uri}`}>
                      <p>{song.preview_url}</p>
                      <img src={song.album.image} alt="" />
                      <strong>{song.name}</strong> by{" "}
                      {song.artists.join(", ")} -{" "}
                      <a href={song.external_url} target="_blank" rel="noopener noreferrer">
                        Listen
                      </a>
                      <button onClick={() => handlePlayingTrack(song.uri)}>Play</button>
                    </li>
                  ))}
                </ul>
                <Player trackUri={playingTrack}/>
              </>
            )}

          </>
          
        ) : (
          <p>Please login!</p>
        )}
        
      </div>
    );
}

export default Home