import { useState, useEffect } from 'react';
import { getGenres } from '../services/openaiService'
import { getSpotifySongs } from '../services/spotifyService'
import { isUserAuthenticated } from '../utils/authUtils';
import { Play, CircleX, CirclePlus   } from 'lucide-react';
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

    const formatDuration = (millis) => {
      const minutes = Math.floor(millis / 60000);
      const seconds = ((millis % 60000) / 1000).toFixed(0);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

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
                  <ul className='grid grid-cols-1 gap-5'>
                    {[...new Map(songs.map((song) => [song.uri, song])).values()].map((song) => (
                        <li key={`${song.id}`} className='flex items-center relative group' onClick={() => handlePlayingTrack(song.uri)}>
                          <div className='relative group' >
                            <img 
                              src={song.album.image} 
                              alt={`album cover ${song.name}`} 
                              className='rounded hover:opacity-75' 
                            />
                            <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                              <i className='text-white'> <Play /></i>
                            </div>
                          </div>

                          <div className='flex-grow pl-4'>
                            <h2 className='font-bold'>{song.name}</h2>
                            <p>{song.artists.join(", ")}</p>
                          </div>

                          <div className='flex flex-row gap-6 not:group-hover'>
                            <button onClick={(e) => {
                                e.stopPropagation()  // prevent li onClick from being triggered
                                handleTogglePlaylistTrack(song)
                              }}>
                              {playlist.some((track) => track.id === song.id) ? 
                              (                        
                                <CircleX />
                              )
                              : 
                               <CirclePlus className='hover:text-white' />
                              }
                            </button>
                            {formatDuration(song.duration)}
                            
                          </div>
                          
                        </li>
                      ))}
                    </ul>
                </div>  
              )}

              <aside>
                <h2>Playlist</h2>
                <ul className='grid grid-cols-1  gap-5'>
                  {playlist && playlist.map((song) => (
                      <li key={`${song.id}`} className='flex items-center relative group' onClick={() => handlePlayingTrack(song.uri)}>
                        <div className='relative group' >
                          <img 
                            src={song.album.image} 
                            alt={`album cover ${song.name}`} 
                            className='rounded hover:opacity-75' 
                          />
                          <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                            <i className='text-white'> <Play /></i>
                          </div>
                        </div>

                        <div className='flex-grow pl-4'>
                          <h2 className='font-bold'>{song.name}</h2>
                          <p>{song.artists.join(", ")}</p>
                        </div>

                        <div className='flex flex-row gap-6 not:group-hover'>
                          <button onClick={(e) => {
                              e.stopPropagation()  // prevent li onClick from being triggered
                              handleTogglePlaylistTrack(song)
                            }}>
                            {playlist.some((track) => track.id === song.id) ? 
                            (                        
                              <CircleX className='hover:text-white' />
                            )
                            : 
                             <CirclePlus className='hover:text-white' />
                            }
                          </button>
                          {formatDuration(song.duration)}
                          
                        </div>
                        
                      </li>
                  ))}
                </ul> 
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