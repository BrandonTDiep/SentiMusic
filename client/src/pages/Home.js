import { useState, useEffect } from 'react';
import SongList from '../components/SongList'
import { getGenres } from '../services/openaiService'
import { getSpotifySongs } from '../services/spotifyService'
import { isUserAuthenticated } from '../utils/authUtils';
import Player from '../components/Player';
const Home = () => {
    const [mood, setMood] = useState("")
    const [genres, setGenres] = useState([])
    const [playlist, setPlaylist] = useState([])
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

    const handleTogglePlaylistTrack = (track) => {
      setPlaylist((prevPlaylist) => 
        prevPlaylist.some((song) => song.id === track.id) ?
        prevPlaylist.filter((song) => song.id !== track.id) :
        [...prevPlaylist, track]
      )
    }

    useEffect(() => {
      setIsAuthenticated(isUserAuthenticated)
    }, []);

    return (
      <div className='container mx-auto px-4 my-6'>
        {isAuthenticated ? (
          <div>
            <form onSubmit={handleSubmit} className='flex justify-center gap-2'>
              <input 
                type="text" 
                placeholder="Enter your mood or feelings"  
                value={mood}  
                onChange={(e) => setMood(e.target.value)} 
                className="input input-bordered w-full max-w-md" 
              />
              <button type='submit' className="btn btn-primary">Search</button>

            </form>

            {genres.length > 0 && (
              <div>
                <h2>Recommended Genres:</h2>
                <ul>
                  {genres.map((genre, index) => (
                    <li key={index}>{genre}</li>
                  ))}
                </ul>
              </div>
             )}

            <div className='grid grid-cols-3 gap-24'>
              {songs.length > 0 && (
                <div className='col-span-2'>
                  <h2>Recommended Songs:</h2>
                  <SongList songs={songs} playlist={playlist} handlePlayingTrack={handlePlayingTrack} handleTogglePlaylistTrack={handleTogglePlaylistTrack} />
                </div>  
              )}

              <aside>
                <h2>Playlist</h2>
                <SongList songs={playlist} playlist={playlist} handlePlayingTrack={handlePlayingTrack} handleTogglePlaylistTrack={handleTogglePlaylistTrack} />
                <button className="btn btn-block mt-5">Create Playlist</button>
              </aside>

            </div>
            
            <div className="player-wrapper">
              <Player trackUri={playingTrack} />
            </div>
        </div>
        ) : (
          <p>Please login!</p>
        )}
        
      </div>
    );
}

export default Home