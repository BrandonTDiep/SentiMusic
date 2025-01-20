import { useState, useEffect } from 'react';
import SongList from '../components/SongList'
import { getGenres } from '../services/openaiService'
import { createSpotifyPlaylist, getSpotifySongs } from '../services/spotifyService'
import { isUserAuthenticated } from '../utils/authUtils';
import Player from '../components/Player';
import logo from '../assets/logo.png'
const Home = () => {
    const [mood, setMood] = useState("")
    const [genres, setGenres] = useState([])
    const [playlist, setPlaylist] = useState([])
    const [playlistName, setPlaylistName] = useState("")
    const [playlistDescription, setPlaylistDescription] = useState("")
    const [songs, setSongs] = useState([])
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [playingTrack, setPlayingTrack] = useState()

    const handleSubmit = async (e) => {
      // stay on same page without reloading
      e.preventDefault();
      setIsLoading(true)
      try {
        const response = await getGenres(mood);
        const genreList = response.split(", ").map((genre) => genre.trim())
        setGenres(genreList);
        const allSongs = []
        for(const genre of genreList){
          const genreSongs = await getSpotifySongs(genre)
          allSongs.push(...genreSongs)
        }
        setSongs(allSongs)

        
      } catch (error) {
        console.error("Error fetching recommendation:", error);
        setGenres("Failed to get a recommendation.")
        setSongs([])
      }
      finally{
        setIsLoading(false)
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

    const handlePlaylistSubmit = async (e) => {
        e.preventDefault()
        document.getElementById("playlist_modal").close()
        await createSpotifyPlaylist(playlistName, playlistDescription, playlist)
    }

    useEffect(() => {
      setIsAuthenticated(isUserAuthenticated)
    }, []);

    return (
      <div className='container mx-auto px-4 my-6'>
        <section className='text-center mb-5'>
          <img src={logo} alt="SentiMusic logo" className='mx-auto'/>
          <p className='text-lg font-extrabold'>Find songs based on your mood and add them to Spotify.</p>
        </section>
        
        {isAuthenticated ? (
          <div>
            {/* Search Form */}
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

            {songs.length > 0 && 
            <div className='grid grid-cols-1 gap-y-24 md:grid-cols-3 md:gap-24 my-32'>
              {/* Recommend Songs */}
              <section className='md: col-span-2'>
                <h2 className='text-2xl font-extrabold mb-10'>Recommended Songs</h2>
                  {isLoading ?
                  <span className="loading loading-bars loading-lg"></span>
                  :
                  <div>
                    <SongList songs={[...new Map(songs.map((song) => [song.uri, song])).values()]} playlist={playlist} handlePlayingTrack={handlePlayingTrack} handleTogglePlaylistTrack={handleTogglePlaylistTrack} />
                  </div>                   
                 }
              </section>
              
              {/* Playlist */}
              <aside className='md:col-span-1'>
                <h2 className='text-2xl font-extrabold mb-10'>Playlist</h2>
                <SongList songs={playlist} playlist={playlist} handlePlayingTrack={handlePlayingTrack} handleTogglePlaylistTrack={handleTogglePlaylistTrack} />
                {playlist.length > 0 && 
                  <button 
                    className="btn btn-block mt-5 btn-primary" 
                    type='button' 
                    onClick={()=>document.getElementById('playlist_modal').showModal()}>
                      Create Playlist
                  </button>
                }
                
                <dialog id="playlist_modal" className="modal">
                  <div className="modal-box">
                    <h3 className="font-bold text-lg">Create Playlist</h3>
                    
                    <form method="dialog" onSubmit={handlePlaylistSubmit} className='py-4'>
                      <button type='button' 
                        onClick={() => document.getElementById("playlist_modal").close()} 
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                          ✕
                      </button>
                      <div className='mb-3'>
                        <label htmlFor="playlist-name" className="label label-text">Name:</label>
                        <input 
                          id='playlist-name' 
                          type="text" 
                          placeholder="Type here" 
                          className="input input-bordered w-full max-w-lg" 
                          onChange={(e) => setPlaylistName(e.target.value)} 
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="playlist-description" className="label label-text">Description:</label>
                        <input 
                          id='playlist-description' 
                          type="text" 
                          placeholder="Type here" 
                          className="input input-bordered w-full max-w-lg" 
                          onChange={(e) => setPlaylistDescription(e.target.value)} 
                        />
                      </div>

                      <div className='modal-action'>
                        <button type='button' className="btn" onClick={() => document.getElementById("playlist_modal").close()}>Close</button>
                        <button type='submit' className="btn btn-outline">Submit</button>
                      </div>                   
                    </form>
                  </div>
                </dialog>
              </aside>

            </div>}
                
            {/* Player */}
            <div className="player-wrapper">
              <Player trackUri={playingTrack} />
            </div>
        </div>
        ) : (
          <p className='text-center text-2xl font-extrabold'>Please login!</p>
        )}
        
      </div>
    );
}

export default Home